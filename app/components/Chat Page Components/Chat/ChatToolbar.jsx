"use client";
import { icons, images } from "@/app/utilities/assets";
import { ConfigProvider, Modal, theme } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import GroupSettings from "./GroupSettings";
import { MoreOutlined } from "@ant-design/icons";

const { darkAlgorithm } = theme;

function ChatToolbar({ chatId, group }) {
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const handleOpenGroupModal = () => {
    setOpenGroupModal(true);
  };
  return (
    <>
      <div className="h-16 p-4 w-full bg-dark-gray text-white">
        <div className="flex items-center justify-between h-full">
          <button className="cursor-pointer" onClick={handleOpenGroupModal}>
            <div className="flex items-center gap-2">
              <div className="overflow-hidden flex rounded-full w-12 h-12">
                {group?.avatarUrl && group?.avatarUrl.includes("etag") && (
                  <Image
                    alt="profile-pic"
                    src={group?.avatarUrl}
                    width={48}
                    height={48}
                  />
                )}
                {(!group?.avatarUrl || !group?.avatarUrl.includes("etag")) && (
                  <Image
                    alt="profile-pic"
                    src={images.PROFILE}
                    width={48}
                    height={48}
                  />
                )}
              </div>
              <h1 className="text-white text-lg font-bold">{group.name}</h1>
            </div>
          </button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Modal
          open={openGroupModal}
          title={
            <div className="flex items-center relative">
              <div className="text-white text-lg font-bold">Group Settings</div>
              <button
                className="cursor-pointer text-white/50 hover:!text-white hover:bg-white/10 rounded-sm absolute -top-1.5 py-1 px-1.5 flex items-center justify-center"
                style={{ insetInlineEnd: "32px" }}
              >
                <MoreOutlined className="text-xl font-bolder" />
              </button>
            </div>
          }
          // onCancel={handleCancel}
          onOk={() => {}}
        >
          <GroupSettings />
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default ChatToolbar;
