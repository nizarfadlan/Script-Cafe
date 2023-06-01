import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {
  handlerModal?: () => void;
}

export default function AvatarUser({ handlerModal }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const actionAvatar = async(key: string | React.Key) => {
    if (key === "signout") {
      await signOut({
        callbackUrl: "/",
      });
    } else if (key === "dashboard") {
      await router.push("/dashboard");
    } else if (key === "profile") {
      await router.push("/dashboard/profile");
    }
  }

  return (
    <>
      {status === "authenticated" && session ?
        <Dropdown placement="bottom-end" backdropVariant="blur">
          <NavbarItem>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                color="secondary"
                size="md"
                classNames={{
                  base: "w-10 h-10 text-base"
                }}
                src="/avatar.png"
              />
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="User menu actions"
            color="secondary"
            closeOnSelect
            onAction={async(key: string | React.Key) => {
              await actionAvatar(key)
            }}
          >
            <DropdownItem key="profile" className="gap-2 h-14">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{session.user.email}</p>
            </DropdownItem>
            <DropdownItem key="dashboard" showDivider>
              Dashboard
            </DropdownItem>
            <DropdownItem key="signout" showDivider color="danger">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      :
        <NavbarItem>
          <Button color="secondary" onPress={handlerModal} aria-label="modal-title">
            Sign In
          </Button>
        </NavbarItem>
      }
    </>
  );
}
