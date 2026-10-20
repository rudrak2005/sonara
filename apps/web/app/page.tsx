import SonoraLoader from "@/app/components/sonora-loader";

export default function Page() {
  return (
    <SonoraLoader
      redirect="/home"
      duration={2100}
    />
  );
}