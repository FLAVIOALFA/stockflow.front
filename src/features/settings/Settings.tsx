import { Heading, Flex, Card, Text, Switch, Box } from "@radix-ui/themes";

export function Settings() {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Settings</Heading>
      
      <Card size="2">
        <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
                <Box>
                    <Text as="div" size="2" weight="bold">Dark Mode</Text>
                    <Text as="div" size="2" color="gray">
                        Switch between light and dark themes
                    </Text>
                </Box>
                <Switch defaultChecked />
            </Flex>
            
            <Flex justify="between" align="center">
                <Box>
                    <Text as="div" size="2" weight="bold">Email Notifications</Text>
                    <Text as="div" size="2" color="gray">
                        Receive daily updates
                    </Text>
                </Box>
                <Switch />
            </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
