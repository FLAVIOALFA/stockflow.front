import { Heading, Table, Badge, Flex } from "@radix-ui/themes";

export function UsersList() {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Users Management</Heading>
      
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
            <Table.Cell>danilo@example.com</Table.Cell>
            <Table.Cell>Developer</Table.Cell>
            <Table.Cell><Badge color="green">Active</Badge></Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
            <Table.Cell>zahra@example.com</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
            <Table.Cell><Badge color="green">Active</Badge></Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
            <Table.Cell>jasper@example.com</Table.Cell>
            <Table.Cell>Viewer</Table.Cell>
            <Table.Cell><Badge color="gray">Inactive</Badge></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
