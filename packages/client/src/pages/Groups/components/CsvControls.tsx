/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Icon, Tooltip, Upload } from 'antd';
import { CSV_DELIMITER } from 'common';
import React from 'react';

import { LocaleContext } from '../../../components/locale';
import { Flex } from '../../../components/Flex';

const CSV_FORMAT = ['name', 'surname', 'index', 'email'].join(
  `${CSV_DELIMITER} `
);

export type CsvControlsProps = {
  onUploadClick?: (_: { file: File }) => void;
  onDownloadClick: () => void;
};

export const CsvControls: React.FC<CsvControlsProps> = ({
  onUploadClick,
  onDownloadClick,
}) => {
  return (
    <LocaleContext.Consumer>
      {({ texts }) => (
        <Flex
          inline
          as="section"
          alignItems="center"
          css={css`
            > * {
              margin-right: 0.5em;
            }
          `}
        >
          <b>CSV</b>
          {onUploadClick && (
            <Upload
              accept="text/csv"
              showUploadList={false}
              customRequest={onUploadClick}
            >
              <Tooltip title={texts.importCsv}>
                <Button
                  type="default"
                  icon="upload"
                  aria-label={texts.importCsv}
                />
              </Tooltip>
            </Upload>
          )}

          <Tooltip title={texts.exportCsv}>
            <Button
              type="default"
              icon="download"
              onClick={onDownloadClick}
              aria-label={texts.exportCsv}
            />
          </Tooltip>
          <Flex inline center cursor="help" size="32px" fontSize="1.2em">
            <Tooltip title={`${texts.csvInfo} "${CSV_FORMAT}"`}>
              <Icon type="question-circle" />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </LocaleContext.Consumer>
  );
};
