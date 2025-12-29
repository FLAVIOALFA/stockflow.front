import { Flex, Text, Avatar, DropdownMenu, Box } from "@radix-ui/themes";
import { useLocation } from "react-router-dom";
import { menuItems } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Generate breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const items = [{ label: 'Inicio', href: '/' }];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const menuItem = menuItems.find((item) => item.path === currentPath);
    // Use menu name or capitalize segment
    const label = menuItem ? menuItem.name : segment.charAt(0).toUpperCase() + segment.slice(1);
    
    items.push({
      label,
      href: currentPath
    });
  });

  return (
    <Flex
      justify="between"
      align="center"
      px="5"
      py="3"
      style={{
        borderBottom: "1px solid var(--gray-5)",
        backgroundColor: "var(--color-background)",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 5,
        width: "100%"
      }}
    >
      <Box>
        <Breadcrumbs items={items} />
      </Box>

      <Flex gap="4" align="center">
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Flex align="center" gap="3" style={{ cursor: "pointer" }}>
              <Flex direction="column" align="end" display={{ initial: "none", sm: "flex" }}>
                <Text size="2" weight="bold">{user?.name || "User"}</Text>
                <Text size="1" color="gray">{user?.email}</Text>
              </Flex>
              <Avatar
                size="2"
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback={user?.name?.[0].toUpperCase() || "U"}
                radius="full"
              />
            </Flex>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red" onClick={logout}>Logout</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
}
