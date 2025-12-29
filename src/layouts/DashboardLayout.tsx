import { Box, Flex } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export function DashboardLayout() {
  return (
    <Flex style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)" }}>
      <Sidebar />
      <Flex direction="column" style={{ marginLeft: "250px", width: "100%" }}>
        <Navbar />
        <Box p="5" style={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
