"use client";
import { groupsService } from "@/app/api/services/groupsService";
import Chat from "@/app/components/Chat Page Components/Chat/Chat";
import Sidebar from "@/app/components/Chat Page Components/Sidebar/Sidebar";
import PrimaryButton from "@/app/components/PrimaryButton";
import { ConfigProvider, Modal } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Page() {
  const chatId = useSearchParams().get("chatId");
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({
    members: [],
    name: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    members: "",
    name: "",
  });
  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      const res = await groupsService.create();
      message.success(t("success"), 2);
      router.push(`/chats?chatId=${res.data._id}`);
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(error.response.data.message, 2);
        error.response.data.errors.forEach((item) => {
          fieldErrors[item.field] = item.message;
        });
        setFieldErrors({ ...fieldErrors });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(chatId);
  }, [chatId]);
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      {chatId === null ? (
        <>
          <div className="">
            <h1 className="text-center m-auto text-6xl text-white py-24">
              {t("start_chatting")}
            </h1>
            <PrimaryButton width="w-full" onClick={() => setOpenModal(true)}>
              {t("create_group")}
            </PrimaryButton>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Modal: {
                  contentBg: '#151523',
                  titleColor: '#ffffff',
                },
              },
            }}
          >
            <Modal
              open={setOpenModal}
              title={t("create_groupd")}
              onCancel={handleCancel}
              onOk={handleCreateGroup}
            >
              <CreateGroupModal
                model={model}
                setModel={setModel}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
              />
            </Modal>
          </ConfigProvider>
        </>
      ) : (
        <Chat chatId={chatId} />
      )}
    </div>
  );
}

export default Page;

const CreateGroupModal = ({ model, setModel, setFieldErrors }) => {
  const fieldValueChanged = (value, fieldName) => {
    setModel((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
    setFieldErrors((prev) => {
      return {
        ...prev,
        [fieldName]: "",
      };
    });
  };
  return <div>create a group</div>;
};
