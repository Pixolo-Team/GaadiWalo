// COMPONENTS //
import { Header } from "@/components/common/Header";

/**
 * Renders the sales profile performance placeholder screen.
 */
export default function ProfilePerformancePage() {
  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col">
        <Header title="My Performance" />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-xl items-center">
            <div className="border-n-200 bg-n-50 w-full rounded-[28px] border p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <span className="bg-n-100 text-n-700 font-secondary w-fit rounded-full px-3 py-1 text-xs font-medium tracking-[0.08em] uppercase">
                    Performance Report
                  </span>

                  <div className="flex flex-col gap-2">
                    <h1 className="text-n-900 font-sans text-2xl font-semibold">
                      Under Construction
                    </h1>
                    <p className="text-n-600 font-secondary text-sm leading-6 sm:text-base">
                      This screen is being prepared and your performance
                      insights will appear here soon.
                    </p>
                  </div>
                </div>

                <div className="border-n-200 bg-n-100 rounded-2xl border p-4">
                  <p className="text-n-800 font-secondary text-sm font-medium">
                    What to expect
                  </p>
                  <p className="text-n-600 font-secondary mt-2 text-sm leading-6">
                    Monthly summaries, lead conversion trends, pipeline
                    progress, and source-wise breakdowns will be available once
                    this module is connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
