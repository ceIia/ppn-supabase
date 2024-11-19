import { CliForm } from "~/components/cli-form";

export default function Home() {
  return (
    <>
      <div className="font-mono bg-stone-950 w-screen h-screen text-stone-50 font-medium text-xs selection:bg-[#6d65fa] selection:text-stone-950">
        <div className="max-w-sm space-y-2">
          <h2 className="text-stone-200">
            <a
              href="https://papernest.com/"
              className="decoration-[#6d65fa]/80 hover:decoration-[#6d65fa] hover:text-[#6d65fa] underline-offset-4 underline"
            >
              papernest
            </a>{" "}
            is hosting{" "}
            <a
              href="https://supabase.com/"
              className="decoration-[rgb(62,207,142)]/50 hover:decoration-[rgb(62,207,142)] hover:text-[rgb(62,207,142)] underline-offset-4 underline selection:bg-[rgb(62,207,142)] selection:text-stone-950"
            >
              Supabase&apos;s
            </a>{" "}
            launch week&apos;s world tour on dec 4th in our Paris office ✨
          </h2>

          <div>
            <p className="text-stone-400">
              📍 157 bvd Macdonald, 75019 Paris | wed 4/12, 7pm
            </p>
          </div>

          <p>
            register to attend for free{" "}
            <a
              href="https://lu.ma/3bmr2ri8"
              className="decoration-cyan-500/50 hover:decoration-cyan-500 hover:text-cyan-500 underline-offset-4 underline selection:bg-cyan-500 selection:text-stone-950"
            >
              here
            </a>
            .
          </p>

          <p>---</p>

          <h2 className="text-stone-200">
            we are looking for tech enthusiasts speakers to join us that day to
            animate a talk.
          </h2>

          <CliForm />
        </div>
        <div className="fixed bottom-0 left-0 text-xs flex justify-between w-full text-stone-600 max-w-sm p-1 *:p-2 *:-m-2 *:block">
          <a href="https://papernest.com/">papernest</a>
          <a href="https://supabase.com/">supabase</a>
          <a href="https://github.com/ceIia/ppn-supabase">code</a>
        </div>
      </div>
    </>
  );
}
