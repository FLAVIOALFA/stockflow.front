import { Heading, Text, Card, Flex, Grid } from "@radix-ui/themes";

export function Dashboard() {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Dashboard</Heading>
      <Text color="gray" size="2">Overview of your activity</Text>

      <Grid columns="3" gap="4" width="auto">
        <Card>
          <Flex direction="column" gap="1">
            <Text weight="bold">Total Users</Text>
            <Text size="6" color="blue">1,234</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text weight="bold">Active Sessions</Text>
            <Text size="6" color="green">56</Text>
          </Flex>
        </Card>
        <Card>
           <Flex direction="column" gap="1">
            <Text weight="bold">Alerts</Text>
            <Text size="6" color="red">3</Text>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}
