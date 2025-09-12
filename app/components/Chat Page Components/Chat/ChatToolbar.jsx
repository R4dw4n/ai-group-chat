"use client";
import { images } from "@/app/utilities/assets";
import { ConfigProvider, Form, Modal, theme } from "antd";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import GroupSettings from "./GroupSettings";
import { MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { messages } from "@/app/utilities/messages";
import { groupsService } from "@/app/api/services/groupsService";

const { darkAlgorithm } = theme;

function ChatToolbar({ chatId, group, members, setGroup, setMembers }) {
  const { t } = useTranslation();
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const groupSettingsRef = useRef();

  useEffect(() => {
    if (group.avatarUrl) {
      setFileList([{ url: group.avatarUrl }]);
    }
  }, []);

  const handleOpenGroupModal = () => {
    setOpenGroupModal(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setAddMembersOpen(false);
    setOpenGroupModal(false);
    if (groupSettingsRef.current && groupSettingsRef.current.cancelForm) {
      groupSettingsRef.current.cancelForm();
    }
  };

  const handleModalOk = () => {
    if (groupSettingsRef.current && groupSettingsRef.current.submitForm) {
      groupSettingsRef.current.submitForm();
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      if (group.name !== values.name) {
        const res = await groupsService.rename(chatId, { name: values.name });
        setGroup({ ...group, name: res.data.name });
      }
      if (values.members.length > 0) {
        await groupsService.addUsers(chatId, { userIds: [...values.members] });
        const res = await groupsService.getMembers(chatId);
        setMembers([...res.data]);
      }
      setOpenGroupModal(false);
      setAddMembersOpen(false);
      setEditMode(false);
    } catch (error) {
      console.log("error", error);
      // messages("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-16 p-4 w-full bg-dark-gray text-white">
        <div className="flex items-center justify-between h-full">
          <button className="cursor-pointer" onClick={handleOpenGroupModal}>
            <div className="flex items-center gap-2">
              <div className="overflow-hidden flex rounded-full w-12 h-12">
                {group?.avatarUrl  && (
                  <Image
                    alt="profile-pic"
                    src={group?.avatarUrl}
                    width={48}
                    height={48}
                    unoptimized={!group?.avatarUrl.includes("etag")}
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
              <div className="text-white text-lg font-bold">
                {t("group_settings")}
              </div>
              <button
                className="cursor-pointer text-white/50 hover:!text-white hover:bg-white/10 rounded-sm absolute -top-1.5 py-1 px-1.5 flex items-center justify-center"
                style={{ insetInlineEnd: "32px" }}
              >
                <MoreOutlined className="text-xl font-bolder" />
              </button>
            </div>
          }
          onCancel={handleCancel}
          onOk={handleModalOk}
        >
          <GroupSettings
            ref={groupSettingsRef}
            group={group}
            setGroup={setGroup}
            members={members}
            editMode={editMode}
            setEditMode={setEditMode}
            handleFormSubmit={handleFormSubmit}
            addMembersOpen={addMembersOpen}
            setAddMembersOpen={setAddMembersOpen}
            fileList={fileList}
            setFileList={setFileList}
          />
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default ChatToolbar;
