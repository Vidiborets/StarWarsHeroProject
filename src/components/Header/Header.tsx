import StarWarsLogo from "@/features/assets/LogoStarWars.svg";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-center">
      <Link href="/">
        <StarWarsLogo />
      </Link>
    </div>
  );
};
export default Header;
