import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
// import { SunIcon, MoonIcon } from "@nextui-org/shared-icons";
import { LightIcon, MoonIcon } from "./Icons";

export default function DarkMode() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        isIconOnly
        size="md"
        variant="light"
        color="default"
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <LightIcon size={20} /> : <MoonIcon size={20} />}
      </Button>
    </>
  )
}
