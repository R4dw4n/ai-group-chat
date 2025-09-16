import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Select, Input } from "antd";
import { useTranslation } from "react-i18next";
import AvatarUpload from "@/app/utilities/AvatarUpload";
import {
  EditOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { groupsService } from "@/app/api/services/groupsService";
import { images } from "@/app/utilities/assets";
import Image from "next/image";

const GroupSettings = forwardRef(
  (
    {
      group,
      editMode,
      members,
      handleFormSubmit,
      setEditMode,
      addMembersOpen,
      setAddMembersOpen,
      fileList,
      setFileList,
      setIsRemoved,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);

    // Expose submitForm method to parent component
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.submit();
      },
      cancelForm: () => {
        form.setFieldsValue({
          name: group.name,
          members: [],
        });
      },
    }));
    useEffect(() => {
      form.setFieldsValue({
        name: group.name,
        members: [],
      });
    }, []);
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
    const { t } = useTranslation();
    return (
      <Form
        form={form}
        className="grid grid-cols-1 !py-4 overflow-y-auto max-h-[600px]"
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <div className="flex gap-5 items-center">
          <AvatarUpload
            fileList={fileList}
            setFileList={setFileList}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            previewOpen={previewOpen}
            setPreviewOpen={setPreviewOpen}
            setIsRemoved={setIsRemoved}
          />
          <Form.Item
            name="name"
            label={t("group_name")}
            className={`col-span-1 ${editMode ? "block" : "hidden"}`}
            required
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="w-100" />
          </Form.Item>
          {!editMode && (
            <>
              <h1 className="text-white text-lg font-bold col-span-1 relative">
                {group.name || " "}
                <button
                  type="button"
                  className="cursor-pointer absolute -right-10 top-0"
                  onClick={() => setEditMode(true)}
                >
                  <EditOutlined className="text-white" />
                </button>
              </h1>
            </>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsergroupDeleteOutlined className="text-white text-2xl" />
              <span className="text-white text-xl">
                {members.length} {t("members")}
              </span>
            </div>
            <button
              type="button"
              className="cursor-pointer p-3"
              onClick={() => setAddMembersOpen(true)}
            >
              <UserAddOutlined className="text-white text-2xl" />
            </button>
          </div>
          <Form.Item
            name="members"
            label={t("add_members")}
            className={`col-span-1 ${addMembersOpen ? "block" : "hidden"}`}
          >
            <Select
              options={options}
              showSearch
              allowClear
              mode="multiple"
              optionFilterProp="label"
              onSearch={handleSearch}
            />
          </Form.Item>
          <div className="mt-5">
            {members.map((member, ind) => (
              <div key={ind} className="flex items-center gap-3 mb-5">
                <div className="overflow-hidden flex rounded-full w-12 h-12">
                  {member?.avatarUrl && (
                    <Image
                      alt="profile-pic"
                      src={member?.avatarUrl}
                      width={48}
                      height={48}
                      unoptimized={!member?.avatarUrl.includes("etag")}
                    />
                  )}
                  {!member?.avatarUrl && (
                    <Image
                      alt="profile-pic"
                      src={images.PROFILE}
                      width={48}
                      height={48}
                    />
                  )}
                </div>
                <span className="text-white text-lg">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Form>
    );
  }
);

GroupSettings.displayName = "GroupSettings";

export default GroupSettings;
