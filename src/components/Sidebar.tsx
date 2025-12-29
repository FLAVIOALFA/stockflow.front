import { Flex, Text, Button, Box } from "@radix-ui/themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, Users, LogOut, Package, Store, Tag, Layers, ArrowLeftRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

  export const menuItems = [
    { name: "Panel de control", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Movimientos", path: "/movements", icon: <ArrowLeftRight size={20} /> },
    { name: "Productos", path: "/products", icon: <Package size={20} /> },
    { name: "Stock", path: "/stocks", icon: <Layers size={20} /> },
    { name: "Marcas", path: "/brands", icon: <Tag size={20} /> },
    { name: "Sucursales", path: "/branches", icon: <Store size={20} /> },
    { name: "Usuarios", path: "/users", icon: <Users size={20} /> },
    { name: "Configuración", path: "/settings", icon: <Settings size={20} /> },
  ];


export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Flex
      direction="column"
      className="sidebar"
      style={{
        width: "250px",
        height: "100vh",
        borderRight: "1px solid var(--gray-5)",
        backgroundColor: "var(--gray-2)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Box p="5">
        <Text size="5" weight="bold" style={{ color: "var(--accent-9)" }}>
          Stockflow
        </Text>
      </Box>

      <Flex direction="column" gap="2" p="2" style={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant={isActive ? "soft" : "ghost"}
                color={isActive ? "blue" : "gray"}
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                  padding: "10px",
                }}
              >
                {item.icon}
                <Text size="2" ml="2">
                  {item.name}
                </Text>
              </Button>
            </Link>
          );
        })}
      </Flex>

      <Box p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
        <Button 
            variant="ghost" 
            color="red" 
            style={{ width: "100%", justifyContent: "flex-start", cursor: "pointer" }}
            onClick={handleLogout}
        >
          <LogOut size={20} />
          <Text size="2" ml="2">Logout</Text>
        </Button>
      </Box>
    </Flex>
  );
}
