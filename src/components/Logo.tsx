import { useTheme } from "../lib/theme";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-10" }: LogoProps) {
  const { theme } = useTheme();
  const src = `${import.meta.env.BASE_URL}${theme === "dark" ? "logo-dark.svg" : "logo-light.svg"}`;
  return <img src={src} alt="" className={className} />;
}
