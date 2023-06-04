import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { LightIcon, MoonIcon } from "./Icons";

export default function DarkMode() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Button
        isIconOnly
        size="md"
        variant="light"
        color="default"
        onPress={toggleTheme}
        startIcon={theme === "light" ? (
          <MoonIcon fill="currentColor" size={20} />
        ) : (
          <LightIcon fill="currentColor" size={20} />
        )}
      />
    </>
  )
}
