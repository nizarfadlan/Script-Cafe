import LayoutDashboard from "@/components/dashboard/Layout";
import { CardItem } from "@/components/dashboard/packagesItem/CardPackageItem";
import ModalAddItemOnPackage from "@/components/dashboard/packagesItem/ModalAddItemOnPackage";
import { ArrowLeftIcon, PlusIcon } from "@/components/libs/Icons";
import { toastCustom } from "@/components/libs/Toast";
import { type CreatePackageInput, createPackageSchema } from "@/server/menu/packageItem/packageItem.schema";
import type { IItemsOnPackage } from "@/types/packateItem.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, useDisclosure } from "@nextui-org/react";
import { itemsOnPackageTable } from "database.config";
import { useLiveQuery } from "dexie-react-hooks";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { IndexableType } from "dexie";

const AddPackageItem: NextPage = () => {
  const router = useRouter();
  const { isOpen: openModalAdd, onOpen: onOpenModalAdd, onOpenChange: onOpenChangeModalAdd } = useDisclosure();

  const handleSaveItem = useCallback(async({
    id,
    quantity
  }: IItemsOnPackage) => {
    const data = await itemsOnPackageTable.where("id").equals(id).limit(1).toArray();

    let save: number | string | IndexableType;
    if (data.length > 0) {
      const itemDataOld: IItemsOnPackage = data[0] as IItemsOnPackage;
      save = await itemsOnPackageTable.update(id, { quantity: itemDataOld.quantity + Number(quantity) });
    } else {
      save = await itemsOnPackageTable.add({
        id,
        quantity: Number(quantity),
      });
    }

    if (save) {
      toastCustom({
        type: "success",
        description: "Successfully save the item"
      });
    } else {
      toastCustom({
        type: "error",
        description: "Failed to save item"
      })
    }
  }, []);

  const { mutate, isLoading } = api.packageItem.createPackage.useMutation({
    onSuccess: async() => {
      toastCustom({
        type: "success",
        description: "Package item has been added",
      });
      await itemsOnPackageTable.clear();
      reset({
        name: "",
        price: 0,
        discountPercent: 0,
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Package item failed to add. ${err.message ?? ""}`,
      });
    }
  });

  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm<CreatePackageInput>({
    mode: "onChange",
    resolver: zodResolver(createPackageSchema)
  });

  const items: IItemsOnPackage[] = useLiveQuery(
    async() => {
      const getData: IItemsOnPackage[] = await itemsOnPackageTable.toArray() as IItemsOnPackage[];

      setValue("items", getData)

      return getData;
    }, []
  ) as IItemsOnPackage[] ?? [];

  const onSubmit: SubmitHandler<CreatePackageInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <LayoutDashboard title="Add Package Item">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Add package item</h1>
        <Card
          className="w-full p-3"
        >
          <CardHeader className="text-lg">
            <Button
              variant="bordered"
              color="danger"
              className="w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
              startIcon={<ArrowLeftIcon size={18} />}
              onPress={() => router.push("/dashboard/menu/package")}
            >
              Back
            </Button>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody className="flex flex-col w-full gap-4">
              <Input
                {...register("name", {
                  required: true,
                })}
                label="Name"
                placeholder="Enter name package item"
                variant="bordered"
                validationState={errors.name ? "invalid" : "valid"}
                id="name"
                isRequired
                errorMessage={errors.name && errors.name?.message}
              />
              <div className="flex flex-col gap-4 md:flex-row">
                <Input
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Price"
                  placeholder="Enter price package item"
                  variant="bordered"
                  validationState={errors.price ? "invalid" : "valid"}
                  id="price"
                  isRequired
                  errorMessage={errors.price && errors.price?.message}
                />
                <Input
                  {...register("discountPercent", {
                    setValueAs: (v: string) => v === "" ? undefined : parseInt(v, 10),
                  })}
                  label="Discount Percent"
                  placeholder="Enter discount package item"
                  variant="bordered"
                  validationState={errors.discountPercent ? "invalid" : "valid"}
                  id="discount"
                  errorMessage={errors.discountPercent && errors.discountPercent?.message}
                />
              </div>
              <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="col-span-1">
                  <div
                    onClick={onOpenModalAdd}
                    aria-label="modal-add-item-on-package"
                    className="w-full flex justify-center h-[320px] px-4 transition border-2 border-neutral-200 hover:border-neutral-400 focus-within:!border-foreground border-dashed rounded-md appearance-none cursor-pointer focus:outline-none">
                    <span className="flex items-center space-x-2">
                      <PlusIcon fill="currentColor" size={18} className="w-6 h-6 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Click to add an item
                      </span>
                    </span>
                  </div>
                </div>
                {items.map((item, index) => (
                  <CardItem key={item.id} index={index} item={item} db={itemsOnPackageTable} />
                ))}
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button color="secondary" type="submit" isDisabled={isLoading} isLoading={isLoading}>
                Submit
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <ModalAddItemOnPackage
        isOpen={openModalAdd}
        onOpenChange={onOpenChangeModalAdd}
        onSave={handleSaveItem}
      />
    </LayoutDashboard>
  );
}

export default AddPackageItem;
