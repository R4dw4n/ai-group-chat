"use client";
import { groupsService } from "@/app/api/services/groupsService";
import Chat from "@/app/components/Chat Page Components/Chat/Chat";
import Sidebar from "@/app/components/Chat Page Components/Sidebar/Sidebar";
import PrimaryButton from "@/app/components/PrimaryButton";
import { RocketChatService } from "@/app/sockets/rocketChatService";
import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Select,
  theme,
  Upload,
  Image,
  App,
  message,
} from "antd";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const { darkAlgorithm } = theme;

function Page() {
  const chatId = useSearchParams().get("chatId");
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);

  const [chatService, setChatService] = useState(null); // Rocket Chat Service
  const [connected, setConnected] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    const authToken = localStorage?.getItem("chatToken");
    const username = localStorage?.getItem("username");
    if (!authToken) {
      console.error("No auth token available");
      return;
    }
    const rocketChatService = new RocketChatService(authToken, username);
    setChatService(rocketChatService);
    const connectionSub = rocketChatService
      .isConnected()
      .subscribe((_connected) => {
        console.log("subscribing to isConnected", _connected);
        setConnected(_connected);
      });
    let res;
    setLoading(true);
    const getGroups = async () => {
      try {
        res = await groupsService.getAll({});
        setGroups(res.data);
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getGroups();

    return () => {
      connectionSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("here", connected);
    if (chatService === null || groups.length === 0 || !connected)
      return () => {};
    // Subscribe to a room after authentication
    let subscriptions = [];
    groups.forEach((group) => {
      const subscription = chatService.subscribeToRoom(group.id).subscribe({
        next: (message) => {
          setReceivedMessage({ ...message });
          console.log("chat page message", message);
        },
        error: (err) => console.error("Subscription error:", err),
      });
      subscriptions.push(subscription);
    });

    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
      chatService.disconnect();
    };
  }, [groups, chatService, connected]);

  const handleCancel = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    console.log(chatId);
  }, [chatId]);
  return (
    <div className="flex h-screen w-screen">
      <Sidebar groups={groups} />
      {chatId === null ? (
        <>
          <div className="m-auto">
            <h1 className="text-center text-6xl text-white py-24">
              {t("start_chatting")}
            </h1>
            <PrimaryButton width="w-full" onClick={() => setOpenModal(true)}>
              {t("create_group")}
            </PrimaryButton>
          </div>
          <ConfigProvider
            theme={{
              algorithm: darkAlgorithm,
            }}
          >
            <Modal
              open={openModal}
              title={t("create_group")}
              onCancel={handleCancel}
              onOk={() => form.submit()}
            >
              <CreateGroupModal form={form} setOpenModal={setOpenModal} />
            </Modal>
          </ConfigProvider>
        </>
      ) : (
        <Chat
          chatId={chatId}
          chatService={chatService}
          receivedMessage={receivedMessage}
        />
      )}
    </div>
  );
}

export default Page;

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateGroupModal = ({ form, setOpenModal }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = (file) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (!file.url && !file.preview) {
        file.preview = yield getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    });

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <span className="text-6xl text-white block">+</span>
      <span className="text-white mb-2 block">{t("upload")}</span>
    </button>
  );
  const handleSelectChange = (value, option) => {
    console.log(value, option);
  };
  const handleSearch = async (value) => {
    try {
      const res = await groupsService.searchUser({ searchTerm: value });
      const opts = res.data.map((user) => {
        return {
          label: user.name,
          value: user.id,
        };
      });
      setOptions([...opts]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormSubmit = async (values) => {
    console.log("values", values);
    console.log("fileList", fileList);
    let res;
    try {
      setLoading(true);
      res = await groupsService.create({ name: values.name });
      const addMembersRes = await groupsService.addUsers(res.data._id, {
        userIds: [...values.members],
      });
      if (fileList.length > 0) {
        const avatarRes = await groupsService.addAvatar(res.data._id, {
          image: fileList[0].originFileObj,
        });
      }
      // FIX MESSAGE FUNCTIONS AND MOVE THE WEBSOCKET CONNECTION LOGIC TO THIS PAGE INSTEAD OF CHAT AREA
      // message.success(t("success"), 2);
      setOpenModal(false);
      router.push(`/${i18n.language}/chats?chatId=${res.data._id}`);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (res?.data?._id) {
          await groupsService.delete(res.data._id);
        }
        message.error(error.response.data.message, 2);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Form
        form={form}
        className="grid grid-cols-1 !py-4"
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Form.Item
          name="members"
          label={t("add_members")}
          className="col-span-1"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={options}
            showSearch
            allowClear
            mode="multiple"
            optionFilterProp="label"
            onChange={handleSelectChange}
            onSearch={handleSearch}
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="name"
          label={t("group_name")}
          className="col-span-1"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="w-100" />
        </Form.Item>
      </Form>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length > 0 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};
