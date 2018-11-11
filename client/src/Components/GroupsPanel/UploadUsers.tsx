import { Button, Upload } from 'antd';
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
  onUpload: (a: any) => void;
}) => {
  const handleUpload = (uploadObject: UploadObject) => {
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      onUpload(btoa(reader.result as string));
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
