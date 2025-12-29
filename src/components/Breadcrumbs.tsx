import { Flex, Text, Link as RadixLink } from "@radix-ui/themes";
import { Link as RouterLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Flex align="center" gap="2" wrap="wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                size={16}
                style={{ color: "var(--gray-8)" }}
              />
            )}

            {isLast ? (
              <Text
                size="2"
                weight="medium"
                style={{ color: "var(--gray-12)" }}
              >
                {item.label}
              </Text>
            ) : (
              <RadixLink 
                asChild 
                size="2" 
                style={{ color: "var(--gray-10)" }}
              >
                <RouterLink
                  to={item.href || "#"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {item.label}
                </RouterLink>
              </RadixLink>
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
}
