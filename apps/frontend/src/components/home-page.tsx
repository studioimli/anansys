import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/");
      return res.data;
    },
  });

  return (
    <div>
      <Title order={1}>Welcome Home!</Title>
      {isLoading && <p>Loading...</p>}
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
}
