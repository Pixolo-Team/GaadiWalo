# Backend EC2 Setup (Sales Demo, Free Tier)

This document sets up a single low-cost EC2 host for the GaadiWalo backend sales demo.
It covers the server only. Deploying the backend container onto it is a separate step.

## Scope and Decisions

| Item | Choice | Why |
| ---- | ------ | --- |
| Region | `ap-south-1` (Mumbai) | Lowest latency for Indian users |
| Instance | `t3.micro` (or `t2.micro`, whichever shows **Free tier eligible**) | 2 vCPU burst, 1 GB RAM, free-tier eligible |
| OS | Ubuntu Server 24.04 LTS or newer (x86_64); demo host runs 26.04 LTS | Long-term support, simple Docker + Certbot install |
| Disk | 20 GB `gp3` | Fits Docker images + logs; free tier covers up to 30 GB |
| Runtime | Docker (existing `apps/backend/Dockerfile`) behind Nginx | Same image as local/Render; Nginx handles HTTPS later |
| Public IP | Elastic IP | Same hourly price as an auto-assigned IP, but survives stop/start |
| Bootstrap | [`apps/backend/deploy/ec2-bootstrap.sh`](../../apps/backend/deploy/ec2-bootstrap.sh) | Swap, Docker, Nginx, Certbot in one script |
| Deploy | [`apps/backend/deploy/deploy-ec2.sh`](../../apps/backend/deploy/deploy-ec2.sh) | Build locally, stream image over SSH, restart container |

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
| AMI | Ubuntu Server 24.04 LTS or newer (HVM), SSD Volume Type, 64-bit (x86) |
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

Use this Elastic IP everywhere below as `<EC2_IP>`.

- Public IPv4 is billed the same (USD 0.005/hour) whether it is auto-assigned or an attached Elastic IP. Associating
  the Elastic IP releases the auto-assigned IP, so it is not billed twice.
- Unlike the auto-assigned IP, the Elastic IP survives instance stop/start, so the frontend URL and DNS stay valid.
- An Elastic IP **not** attached to a running instance still costs USD 0.005/hour. Release it when the demo ends.

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

## Deploying the Backend

[`apps/backend/deploy/deploy-ec2.sh`](../../apps/backend/deploy/deploy-ec2.sh) runs from the repository root on a
laptop with Docker running. It:

1. Builds `gaadiwalo-backend:<git short sha>` for `linux/amd64` from `apps/backend/Dockerfile`
2. Streams the image to the host over SSH (`docker save | gzip | ssh docker load`), so no registry is needed
3. Optionally uploads the backend env file to `/opt/gaadiwalo/.env` (mode `0600`)
4. Replaces the `gaadiwalo-backend` container (`--restart unless-stopped`, bound to `127.0.0.1:8080` behind Nginx)
5. Polls the container's `/health` on the host (`127.0.0.1:8080`) and prints container logs if it never becomes healthy

First deploy, before secrets are available:

```bash
EC2_HOST=<EC2_IP> SSH_KEY=~/Documents/keys/product-backend-key.pem apps/backend/deploy/deploy-ec2.sh
```

Without an env file on the server, the script creates an empty `/opt/gaadiwalo/.env`. The container starts and
`/health` responds, but Supabase-backed endpoints (auth, leads, admin) fail until secrets are added.

Add or update secrets later by creating `apps/backend/.env` from `.env.example` (gitignored, plain `KEY=value` lines,
no quotes, since Docker reads values literally) and re-running with `ENV_FILE`:

```bash
EC2_HOST=<EC2_IP> SSH_KEY=~/Documents/keys/product-backend-key.pem ENV_FILE=apps/backend/.env apps/backend/deploy/deploy-ec2.sh
```

Useful commands on the host:

```bash
docker logs -f gaadiwalo-backend
```

```bash
docker ps --filter name=gaadiwalo-backend
```

## HTTPS (Let's Encrypt)

The demo backend is served at `https://gadiwale-backend.pixolotechnologies.com` (DNS `A` record -> `3.6.163.232`).

[`apps/backend/deploy/enable-https.sh`](../../apps/backend/deploy/enable-https.sh) sets the Nginx `server_name`, issues
the certificate with `certbot --nginx`, adds an HTTP -> HTTPS redirect, and dry-runs renewal. Running it accepts the
Let's Encrypt Subscriber Agreement.

```bash
EC2_HOST=<EC2_IP> SSH_KEY=~/Documents/keys/product-backend-key.pem BACKEND_DOMAIN=<hostname> apps/backend/deploy/enable-https.sh
```

- The domain must resolve to `<EC2_IP>` first, and security group ports 80 and 443 must be open (80 is used for
  issuance and renewal challenges).
- Optional `CERTBOT_EMAIL=<email>` registers expiry notices; the demo host is registered without an email.
- Certificates last 90 days; the `certbot.timer` systemd timer renews them automatically and reloads Nginx.
- The renewal dry-run waits a random delay of up to ~8 minutes when non-interactive. That pause is expected.
- After HTTPS is enabled, Nginx only answers for the configured hostname. Requests to the bare IP return `404`, and
  `/nginx-health` is reachable at `https://<hostname>/nginx-health`.

## Next Steps

1. Set the Vercel frontend API base URL to `https://gadiwale-backend.pixolotechnologies.com`.
2. Upload the backend `.env` (see Deploying the Backend) so Supabase-backed endpoints work.
3. After the demo, terminate the instance, release the Elastic IP, and delete the DNS record. the Vercel frontend API base URL to the HTTPS backend URL (Vercel pages cannot call plain HTTP APIs).
3. After the demo, terminate the instance and release the Elastic IP.
