import { ChangeEvent, FC, PropsWithChildren, useRef } from "react";

import "./index.scss";
import axios from "axios";
import { UploadFile, UploadList } from "./UploadList";

export interface UploadProps extends PropsWithChildren {
  action: string;
  headers?: Record<string, any>;
  name?: string;
  data?: Record<string, any>;
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  /** 上传前校验，限制用户上传图片的格式尺寸、大小等 */
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    headers,
    name,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
  } = props;

  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFileOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    uploadFiles(files);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const uploadFiles = (fileList: FileList) => {
    let postFiles = Array.from(fileList);
    postFiles.forEach((file: File) => {
      if (!beforeUpload) {
        post(file);
      } else {
        const result = beforeUpload(file);
        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile);
          });
        } else if (result) {
          post(file);
        }
      }
    });
  };

  const post = (file: File) => {
    const formData = new FormData();

    formData.append(name || "file", file);

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    axios
      .post(action, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials,
        onProgress: (e: any) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          if (percentage < 100) {
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then((resp) => {
        onSuccess?.(resp.data, file);
        onChange?.(resp.data);
      })
      .catch((err) => {
        onError?.(err, file);
        onChange?.(err);
      });
    const fileList: UploadFile[] = [
      {
        uid: "11",
        size: 111,
        name: "xxxx",
        status: "uploading",
        percent: 50,
      },
      {
        uid: "22",
        size: 111,
        name: "yyy",
        status: "success",
        percent: 50,
      },
      {
        uid: "33",
        size: 111,
        name: "zzz",
        status: "error",
        percent: 50,
      },
    ];
    return (
      <div className="upload-component">
        <div className="upload-input" onClick={handleClick}>
          {children}
          <input
            className="upload-file-input"
            type="file"
            ref={fileInput}
            onChange={handleFileOnChange}
            accept={accept}
            multiple={multiple}
          />
        </div>
        <UploadList fileList={[]} onRemove={() => {}} />
      </div>
    );
  };

  return <div></div>;
};
