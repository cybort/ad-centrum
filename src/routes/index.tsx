import { createFileRoute } from "@tanstack/react-router";
import { Journey } from "@/journey/Journey";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Journey />;
}
