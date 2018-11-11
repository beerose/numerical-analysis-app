import { Button, Upload } from 'antd';
import { Base64 } from 'js-base64';
import * as React from 'react';

import { LABELS } from '../../utils/labels';

type UploadObject = {
  file: File;
};

export const UploadUsers = ({
  className,
  onUpload,
}: {
  className?: string;
  onUpload: (fileContent: any) => void;
}) => {
  const handleUpload = (uploadObject: UploadObject) => {
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      onUpload(reader.result);
    };
  };

  return (
    <Upload accept="text/csv" showUploadList={false} customRequest={handleUpload}>
      <Button type="default" icon="upload" className={className}>
        {LABELS.upload}
      </Button>
    </Upload>
  );
};
