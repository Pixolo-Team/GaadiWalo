# Backend EC2 Setup (Sales Demo, Free Tier)

This document sets up a single low-cost EC2 host for the GaadiWalo backend sales demo.
It covers the server only. Deploying the backend container onto it is a separate step.

## Scope and Decisions

| Item | Choice | Why |
| ---- | ------ | --- |
| Region | `ap-south-1` (Mumbai) | Lowest latency for Indian users |
| Instance | `t3.micro` (or `t2.micro`, whichever shows **Free tier eligible**) | 2 vCPU burst, 1 GB RAM, free-tier eligible |
| OS | Ubuntu Server 24.04 LTS (x86_64) | Long-term support, simple Docker + Certbot install |
| Disk | 20 GB `gp3` | Fits Docker images + logs; free tier covers up to 30 GB |
| Runtime | Docker (existing `apps/backend/Dockerfile`) behind Nginx | Same image as local/Render; Nginx handles HTTPS later |
| Public IP | Elastic IP | Stable address for the frontend `.env` and DNS |
| Bootstrap | [`apps/backend/deploy/ec2-bootstrap.sh`](../../apps/backend/deploy/ec2-bootstrap.sh) | Swap, Docker, Nginx, Certbot in one script |

Images are built on a laptop or CI (`--platform=linux/amd64`), never on the 1 GB instance.

## Cost Guardrails (Do These First)

Which free tier applies depends on when the AWS account was created:

- **Account created on/after 15 Jul 2025 ("Free plan")**: USD 100 sign-up credits (up to USD 100 more by completing
  onboarding tasks), valid 6 months. A `t3.micro` + 20 GB disk + public IP uses roughly USD 12-14/month of credits.
  The account must be upgraded to a paid plan before credits or the 6 months run out, or it is closed.
- **Account created before 15 Jul 2025 (legacy, first 12 months)**: 750 hours/month of `t2.micro`/`t3.micro`
  (whichever is marked eligible in the region), 30 GB EBS, and 750 hours/month of public IPv4 are free.
- Check which one applies in **Billing and Cost Management -> Free Tier** (or the credits page).

Set up the alerts before launching anything:

1. Billing and Cost Management -> **Budgets** -> **Create budget** -> **Use a template** -> **Zero spend budget**.
   Add the team email. This emails on the first cent of non-free/non-credit spend.
2. Create a second budget from the **Monthly cost budget** template with amount `5` USD as a safety net.
3. Billing preferences -> enable **Receive Free Tier usage alerts**.

Things that silently cost money:

- An Elastic IP that is **not attached** to a running instance (~USD 3.6/month). Release it if the demo ends.
- A **stopped** instance still pays for its EBS volume (and Elastic IP outside the free tier). Terminate when done.
- T3 **Unlimited** CPU credit mode can bill for sustained CPU. Set it to **Standard** (step 3 below).
- Leftover snapshots, extra volumes, NAT gateways, load balancers. None are needed for this setup.

## Step 1: Switch Region

Top-right region selector in the AWS Console -> **Asia Pacific (Mumbai) ap-south-1**.
Every step below must happen in this region.

## Step 2: Create the Key Pair

EC2 -> Network & Security -> **Key Pairs** -> **Create key pair**:

- Name: `gaadiwalo-demo`
- Type: `ED25519`
- Format: `.pem`

Move the downloaded file and lock its permissions:

```bash
mv ~/Downloads/gaadiwalo-demo.pem ~/.ssh/gaadiwalo-demo.pem
```

```bash
chmod 400 ~/.ssh/gaadiwalo-demo.pem
```

Never commit this file. Share it with teammates through a password manager only.

## Step 3: Launch the Instance

EC2 -> Instances -> **Launch instances**:

| Field | Value |
| ----- | ----- |
| Name | `gaadiwalo-backend-demo` |
| AMI | Ubuntu Server 24.04 LTS (HVM), SSD Volume Type, 64-bit (x86) |
| Instance type | `t3.micro` (pick `t2.micro` instead if only it shows **Free tier eligible**) |
| Key pair | `gaadiwalo-demo` |

**Network settings** -> **Edit**:

- VPC / subnet: default VPC, any subnet (no preference)
- Auto-assign public IP: **Enable**
- Firewall: **Create security group**
  - Name: `gaadiwalo-backend-sg`
  - Description: `GaadiWalo backend demo - SSH from team IP, HTTP/HTTPS public`
  - Rule 1: `SSH`, TCP 22, Source type **My IP**
  - Rule 2: `HTTP`, TCP 80, Source **Anywhere** (`0.0.0.0/0`)
  - Rule 3: `HTTPS`, TCP 443, Source **Anywhere** (`0.0.0.0/0`)

Do not open port 8080. Nginx is the only public entry point.

**Configure storage**: `20` GiB, `gp3`, **Delete on termination: Yes**.

**Advanced details**:

- Credit specification: **Standard** (only shown for T3; T2 is always standard)
- Metadata version: **V2 only (token required)**
- User data: paste the full contents of [`apps/backend/deploy/ec2-bootstrap.sh`](../../apps/backend/deploy/ec2-bootstrap.sh)

Click **Launch instance**. Bootstrap takes about 3-5 minutes after the instance shows `Running`.

## Step 4: Attach an Elastic IP

EC2 -> Network & Security -> **Elastic IPs** -> **Allocate Elastic IP address** -> Allocate.
Select it -> **Actions** -> **Associate Elastic IP address** -> instance `gaadiwalo-backend-demo` -> Associate.

Use this Elastic IP everywhere below as `<EC2_IP>`. The auto-assigned public IP is released, so it is not billed twice.

## Step 5: Verify the Host

From your Mac:

```bash
curl http://<EC2_IP>/nginx-health
```

Expected response: `ok`.

SSH in:

```bash
ssh -i ~/.ssh/gaadiwalo-demo.pem ubuntu@<EC2_IP>
```

On the instance:

```bash
tail -n 20 /var/log/gaadiwalo-bootstrap.log
```

The log must end with `GaadiWalo bootstrap finished`, followed by Docker/Nginx versions and a `free -h` table
that shows `Swap: 2.0Gi`. Then confirm Docker works without `sudo` (log out and back in once first):

```bash
docker run --rm hello-world
```

`http://<EC2_IP>/health` returns `502 Bad Gateway` until the backend container is deployed. That is expected.

If User data was missed at launch, copy the script over and run it manually:

```bash
scp -i ~/.ssh/gaadiwalo-demo.pem apps/backend/deploy/ec2-bootstrap.sh ubuntu@<EC2_IP>:~
```

```bash
ssh -i ~/.ssh/gaadiwalo-demo.pem ubuntu@<EC2_IP> "sudo bash ~/ec2-bootstrap.sh"
```

## Step 6: Optional SSH Shortcut

Add to `~/.ssh/config` on your Mac:

```text
Host gaadiwalo-demo
  HostName <EC2_IP>
  User ubuntu
  IdentityFile ~/.ssh/gaadiwalo-demo.pem
```

Then `ssh gaadiwalo-demo` is enough.

## What the Bootstrap Script Configures

- Timezone `Asia/Kolkata`, full `apt upgrade`
- 2 GB swap file with `vm.swappiness=10`
- Docker Engine + compose plugin from Docker's official apt repo, `ubuntu` user in the `docker` group
- Docker log rotation (`10m` x 3 files per container)
- Nginx site `gaadiwalo-backend`: `:80` -> `127.0.0.1:8080`, plus `/nginx-health`
- Certbot with the Nginx plugin (installed, not yet configured)
- `/opt/gaadiwalo` (owner `ubuntu`, mode `0750`) for the backend `.env` file

## Next Steps (Not Part of This Setup)

1. Deploy the backend container: build `linux/amd64` image, ship it (registry or `docker save | ssh docker load`),
   create `/opt/gaadiwalo/.env` from `.env.example`, run it on `127.0.0.1:8080` with `--restart unless-stopped`.
2. Point a domain/subdomain (e.g. `api.<domain>`) at `<EC2_IP>`, then run
   `sudo certbot --nginx -d api.<domain>` for HTTPS.
3. Set the Vercel frontend API base URL to the HTTPS backend URL (Vercel pages cannot call plain HTTP APIs).
4. After the demo, terminate the instance and release the Elastic IP.
