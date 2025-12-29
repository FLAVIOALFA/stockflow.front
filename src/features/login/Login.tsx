import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

export function Login() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100vh",
        backgroundColor: "var(--gray-1)",
        background: "linear-gradient(135deg, var(--accent-3) 0%, var(--gray-1) 100%)",
      }}
    >
      <Card size="4" style={{ width: 400, padding: 30, boxShadow: "var(--shadow-5)" }}>
        <Flex direction="column" gap="5">
          <Box>
            <Heading size="6" align="center" mb="2">
  ¡Bienvenido!
</Heading>
            <Text align="center" as="p" color="gray" size="2">
              Accede a tu cuenta para continuar
            </Text>
          </Box>

          <Button 
            size="3" 
            variant="solid" 
            style={{ cursor: 'pointer' }} 
            onClick={() => window.location.href = "http://localhost:1337/api/connect/auth0"}
          >
            Acceder
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
