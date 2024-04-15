import { FC } from "react";
import { Progress } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export interface UploadFile {
  uid: number | string;
  size: number;
  name: string;
  status?: "ready" | "uploading" | "success" | "error";
  percent?: number;
  row?: File;
  response?: any;
  error?: any;
}

interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (file: UploadFile) => void;
}

export const UploadList: FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props;

  return (
    <ul className="upload-list">
      {fileList.map((file) => (
        <li
          className={`upload-list-file upload-list-file-${file.status}`}
          key={file.uid}
        >
          <span className="file-name">
            {(file.status === "uploading" || file.status === "ready") && (
              <LoadingOutlined className="upload-icon" />
            )}
            {file.status === "success" && <CheckOutlined />}
            {file.status === "error" && <CloseOutlined />}
            {file.name}
          </span>
          <span className="file-actions">
            <DeleteOutlined onClick={() => onRemove(file)} />
          </span>
          {file.status === "uploading" && (
            <Progress percent={file.percent || 0} />
          )}
        </li>
      ))}
    </ul>
  );
};
