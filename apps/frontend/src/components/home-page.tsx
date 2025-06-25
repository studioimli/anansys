import { Button, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function HomePage() {
  const {
    mutate: createGameSession,
    isPending,
    data: mutateData,
  } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3000/ai/gsm/create-session",
        {
          setting: "Island",
          suspectCount: 8,
          murderType: "Planned",
          twist: "Hidden Body",
          conflictStructure: "Time Loop",
          killerSelectionLogic: "Based on Motive",
          victimArchetype: "Heroic",
          timeOfDay: "Night",
          locationCount: "Large",
          difficultyLevel: "Insane",
        }
      );
      return res.data;
    },
  });

  return (
    <div>
      <Title order={1}>Welcome Home!</Title>
      {isPending && <p>Loading...</p>}
      {mutateData && <p>{JSON.stringify(mutateData)}</p>}
      <Button onClick={() => createGameSession()} loading={isPending}>
        Create Game Session
      </Button>
    </div>
  );
}
