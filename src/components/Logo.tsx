type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-10" }: LogoProps) {
  return <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className={className} />;
}
