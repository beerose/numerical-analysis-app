/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import React, { useContext, useEffect } from 'react';
import { animated, config, useSpring } from 'react-spring';

import { Flex } from '../components';
import { LocaleContext } from '../components/locale';
import { LinkButton } from '../components/LinkButton';
import { Colors } from '../utils';

const AnimFeTurbulence = animated('feTurbulence');
const AnimFeDisplacementMap = animated('feDisplacementMap');

const Background = () => {
  const [{ freq, scale }, set] = useSpring(() => ({
    config: { ...config.slow, duration: 10000 },
    freq: '0.0, 0.0',
    scale: 100,
  }));

  useEffect(() => {
    const listener = () => {
      set({
        freq: `0.001, 0.01`,
        onRest: () => {
          set({
            freq: '0.0, 0.0',
            onRest: () => undefined,
            scale: 100,
          });
        },
        scale: 50,
      });
    };

    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  });

  return (
    <svg
      version="1"
      width="357"
      height="400"
      viewBox="0 0 3570 4000"
      css={css`
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        background-color: ${Colors.PrimaryLight};

        z-index: -1;
      `}
      preserveAspectRatio="xMaxYMax meet"
    >
      <defs>
        <filter id="water">
          <AnimFeTurbulence
            type="fractalNoise"
            baseFrequency={freq}
            numOctaves="1"
            result="TURB"
            seed="8"
          />
          <AnimFeDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            in="SourceGraphic"
            in2="TURB"
            result="DISP"
            scale={scale}
          />
        </filter>
      </defs>
      <g filter="url(#water)">
        <path d="M0 2000V0h3570v4000H0V2000z" fill="#1373CC" />
        <g fill="#1890FF">
          <path d="M0 2000C1106.72-982.956 3533.245-433.273 3554 3825c16 175-456.425 180.717-703.26 180.37-525-1-718.74-10.37-697.74-18.37 30-12 35-25 12-33-16-7-21-34-6-34s22-30 11-50c-8-14-7-26 2-40 11-18 10-23-4-31-13-7-16-21-14-65 2-30-1-57-5-60-13-8-11-62 2-70 7-4 9-22 6-47-3-22-2-49 2-61 5-11 11-46 15-76l6-55-21 40c-14 26-21 57-20 88 1 26-2 47-6 47-17 0-36 66-37 130-1 57-4 71-24 86-20 18-21 22-10 57s10 40-9 55c-11 10-24 34-27 55-4 20-11 37-17 37s-7 5-4 10c3 6 0 10-7 10-9 0-9 3 2 10 10 6-92 9-295 8-170-1-292-3-271-5 45-5 61-18 61-53 0-19 5-25 23-24 23 1 30-20 11-32-7-4-2-16 13-33 13-14 29-38 36-53 7-18 19-28 32-28s20-7 20-19c0-10 7-24 15-31s15-18 15-24 9-17 21-24c12-8 18-19 15-28-4-10 4-18 24-26 28-9 30-14 30-58 0-28 5-52 13-57 6-4 13-26 14-48s3-54 3-72c2-24 8-33 25-37 13-3 27-15 30-26 4-12 24-32 45-45 30-19 37-29 33-45-5-17-2-21 13-20 32 4 37 1 24-15-7-8-9-23-5-32 6-17 7-17 21 1 14 19 14 19 14-2 0-13-7-25-16-29-12-4-10-9 12-24 15-10 31-16 35-13 13 8 20-28 8-43-10-11-3-22 35-58 25-25 46-48 46-52 0-5 9-19 20-33s20-37 20-52c0-22 7-31 33-42 40-17 81-61 74-79-3-9 7-20 29-30 19-9 34-22 34-30 0-7 12-24 28-39 15-14 33-32 40-39 7-8 39-36 71-64 34-29 62-62 66-77 8-32 16-39 65-53 22-7 36-18 38-30 7-45 11-49 30-31 23 20 36 21 28 1-4-11 3-19 19-25 14-5 25-14 25-20 0-5 7-10 15-10 25 0 17-15-26-54-59-53-98-71-121-57-26 16-32 14-46-19-12-25-18-29-39-23-22 5-25 3-20-11 10-26-3-47-24-41-20 7-27-9-9-20 21-13 9-25-21-23-19 2-34-2-36-9-3-9 6-13 25-13 31 0 42-14 42-52 0-17 5-20 30-16 18 3 35-1 42-9 8-11 7-12-5-7-9 3-26-1-39-10-19-14-20-16-5-16 13 0 17-6 15-22-2-18-13-25-45-33-46-11-69-28-59-43 6-10 94-7 128 4 28 9 22-21-8-41-20-13-38-16-71-11-34 4-45 2-50-10-3-8 0-21 6-27 10-9 15-8 25 5 11 16 14 14 24-19 6-20 7-43 3-52-5-9-11-33-15-53-4-21-16-44-28-52-20-14-26-9-129 96-60 61-109 112-109 114s12-1 26-6c14-6 27-10 29-10 10 0 33 63 28 77-5 12-1 14 16 8 21-6 22-5 15 32-9 52-22 83-33 83-5 0-11 8-15 18-3 9-9 23-12 30s2 12 15 12c11 0 22 4 25 8 8 14-11 35-27 29-23-9-29 21-7 33 11 6 20 23 22 43 2 24 8 33 26 35 14 2 22-2 22-12 0-23 22-66 33-66 6 0 19-7 29-16 14-14 20-14 33-4 8 7 15 21 15 31s7 22 16 27c15 8 15 10 0 15-24 10-21 79 5 102 12 12 19 29 17 45-1 14 1 30 5 37s-4 15-21 22c-29 11-72 45-72 57 0 4 7 12 17 19s13 17 8 25c-6 10-11 9-21-4-20-29-50-16-46 20 2 24-6 39-42 77-24 26-58 52-74 58-17 6-32 19-35 30-3 12-17 22-36 25-18 4-36 15-42 26s-23 24-39 29c-15 6-30 19-33 30-3 10-12 22-21 25-22 8-76 60-76 72 0 5-9 12-20 15s-23 13-27 24c-21 57-147 183-184 183-10 0-17-33-26-120-10-95-10-134 1-245 15-154 13-189-6-193-11-2-18 3-18 11s-6 17-14 20c-7 3-17 23-21 44-3 21-16 48-28 61-14 15-22 38-24 74-3 52-23 88-50 88s-73 31-73 49c0 10 10 36 23 58 59 105 90 153 97 153 4 0 13 12 19 28 6 15 15 34 20 42s17 40 27 70c9 30 25 69 35 86 15 27 16 43 8 104-5 39-11 75-14 81-10 15-33 10-44-8-9-15-10-12-11 14 0 26-5 34-25 39-13 3-30 13-37 21s-23 19-36 24-26 18-29 29-13 22-22 25c-21 7-72 52-70 62 3 20-2 23-22 13-16-9-24-8-38 4-10 9-22 16-28 16-5 0-20 11-32 24-13 14-29 22-36 20-7-3-15 2-18 10-4 9-17 16-31 16-32 0-42 16-15 23 26 7 20 32-7 32-10 0-24 3-31 8-7 4-16 0-22-10-9-16-12-14-25 17-8 20-26 42-40 50-14 7-26 17-26 20 0 4-25 20-56 36s-59 34-61 42c-4 10-39 12-154 11-138-1-183-10-125-25 20-5 23-11 22-44 0-28 5-43 21-57 20-16 63-119 63-150 0-7-18-18-41-24-34-11-42-10-50 2-11 18-11 29 0 29 5 0 11-7 15-15 3-8 10-15 16-15 12 0 14 43 3 54-5 4-8 22-8 39 0 26-5 32-33 39-18 5-41 17-52 28-17 17-17 20-4 28 12 6 13 14 5 34-8 21-15 25-32 21-15-4-26 0-35 12-22 29-17 34 28 28 28-4 39-3 34 5-4 7-98 11-281 12l-275 1zm3133.09 1943.838c11-4-11.757-17.135-43.757-17.135-31 0-13.207 34.405-13.207 38.405 0 10 44.351 6.748 56.964-21.27zM3254 3858c-7-22-21-38-36-38-12 0-10 18 4 40 18 28 41 26 32-2zm283-165c-2-32-3-6-3 57s1 89 3 58c2-32 2-84 0-115zm10-215c-2-18-4-6-4 27s2 48 4 33 2-42 0-60zm-2707 15c11-21 34-60 51-88 16-27 34-60 39-72 5-11 14-24 19-28 17-10 13-22-11-28-32-9-45 8-54 66-4 29-9 44-12 35-5-27-19-22-31 12-7 21-17 30-32 30-18 0-19 2-9 15 10 12 10 22 3 38-7 15-7 29-1 40 13 23 15 22 38-20zm567-43c25-9 30-16 29-40-1-41-18-37-49 10-28 43-26 46 20 30zm1950-125c6-15 7-27 2-31-11-6-49 37-42 48 9 16 28 7 40-17zm-2360-77c28-26 29-38 5-38-23 0-42 19-42 42 0 24 9 23 37-4zm2324-115c6 10 14 15 20 12 15-10 11-52-6-59-8-3-12-12-9-21 4-11 0-15-16-15-19 0-21-2-10-15 16-20-1-41-25-31-12 4-15 12-10 24 15 33 17 82 5 97-11 13-9 19 6 34 18 17 19 17 27-13 8-26 10-28 18-13zm-2247 5c15-18 36-44 46-56 28-33 25-37-17-37-34 0-38 3-44 33-4 18-16 43-28 56-21 22-19 36 5 36 7 0 24-15 38-32zm2338-129c4-45-11-61-37-39-12 10-16 9-21-4-7-19-34-21-34-2 0 7 9 25 20 39s20 30 20 36 11 11 24 11c21 0 24-5 28-41zm-2169-107c70-117 78-132 69-132-6 0-13 7-16 16-5 12-14 15-41 10-29-6-36-3-46 16-7 13-15 36-19 53-4 19-12 30-22 30s-24 9-32 20c-13 18-12 22 7 43 18 19 19 26 9 42-23 37-11 35 24-5 19-22 50-64 67-93zm-289 101c4-4 15-8 24-8s18-9 20-20 11-25 19-32c18-14 9-33-18-33-14 0-19 7-19 29 0 36-19 51-27 22-6-24-11-25-47-11-14 5-26 16-26 25 0 20 16 19 24-1s26-9 26 17c0 19 11 25 24 12zm2213-319c10-21 10-31 0-48l-12-21-3 23c-3 20-38 44-60 41-26-4-22 4 8 15 50 19 54 19 67-10zm-83-97c-18-10-40 6-30 22 5 7 13 7 26-1 17-11 18-14 4-21zm-684-349c0-10-3-18-8-18-14 0-32 39-25 56 6 15 7 15 20-2 7-10 13-26 13-36zm-12-111c5-25-34-22-41 3-4 16-1 19 16 16 12-2 23-10 25-19zm145-93c10-20 16-39 13-41-2-2-7 5-11 16-3 12-15 21-25 21-13 0-17 5-13 20 8 28 15 25 36-16zM990 1743c-14-2-47-11-74-19-68-19-88-17-46 6 23 13 53 19 90 18 30 0 44-3 30-5zm61-634c22-22 39-42 37-44s-25-10-51-17c-53-14-67-6-67 40 0 17 24 57 38 61 1 1 20-17 43-40z" />
          <path d="M2446 2197c-19-14-19-14 0-24 25-13 69-1 69 17 0 20-45 24-69 7zm-136-442c0-8 9-15 20-15s20 7 20 15-9 15-20 15-20-7-20-15zm74-49c-8-21 3-36 27-36 25 0 24 22-1 38-17 10-21 10-26-2z" />
        </g>
        <g fill="#64b5ff">
          <path d="M720.352 3986.815c11-7 12-10 2-10s-10-3 1-15c9-8 13-23 10-34-3-13 4-29 20-45 22-22 23-27 12-50-13-24-12-24 19-19s32 4 30-28c-1-18-9-38-17-44-21-15-10-61 19-84 13-10 24-24 24-29 0-6 9-17 20-25 15-11 19-21 14-43-5-24-1-32 24-46 18-11 32-29 35-48 10-48 47-121 83-166 19-23 34-46 34-53 0-6 5-11 10-11 6 0 10-8 8-17-2-12 4-19 19-21 14-2 23-11 25-25s10-22 23-22c14 0 21-8 23-25 2-13 21-45 42-70 33-40 43-46 74-45 20 1 39 5 43 8 3 4 13 1 22-7s21-14 26-13c12 2 19-38 11-59-4-12-10-12-25-4-11 6-18 16-15 24 3 9-6 15-27 20-60 12-66 7-30-24 19-16 37-27 40-25 4 2 29-7 56-21 66-31 79-31 71 2-4 14-3 31 3 37 11 14-5 40-31 50-22 8-23 23-3 31 9 3 24-3 34-13 11-11 30-22 43-26 16-4 19-4 9 3s-12 21-8 45c5 31 3 36-16 39-12 2-23 10-25 19-2 12 8 18 38 23 26 4 40 11 40 21 0 8-6 15-14 15-7 0-25 9-39 20s-32 20-41 20c-10 0-16 9-16 26 0 18-5 25-17 23-41-4-47 0-29 20 38 41 16 152-32 167-9 3-37 14-62 25l-45 18 70-1c39 0 85 3 103 7 26 6 32 4 32-9 0-9 7-16 15-16s15 7 15 15-7 15-15 15c-10 0-15 11-15 35s-5 35-15 35c-8 0-15-7-15-15s-7-15-16-15c-11 0-14 6-9 20 3 11 2 20-2 20-14 0-40-23-46-40-3-8-6-3-6 12-1 15-5 30-11 33-5 3-10 15-10 25 0 24-18 36-32 22-8-8-8-15 1-26 14-17 6-23-40-31-27-5-32-4-21 6 22 23 14 38-19 37-19-1-37 6-44 16-7 9-19 14-29 10-15-6-17-2-20 28-1 7 10 15 24 19l25 7-25 1c-15 1-31 6-38 13-9 9-15 9-23 1s-22-6-50 9c-43 22-43 42-1 34 15-3 34-2 42 4 13 8 13 10-2 10-9 0-21 8-27 18-9 16-11 16-23 0-9-12-22-15-41-11-27 5-27 6-11 24s16 20-2 34c-10 8-38 15-62 15-26 0-41 4-37 10 3 6 15 10 26 10 23 0 24 11 3 51-22 44-50 35-46-14 2-21-2-37-8-37-12 0-16 10-25 62-5 31-10 38-38 44-27 6-29 8-13 14 18 6 18 7-5 13-34 10-46 8-29-3zm127-205c-4-8-2-17 4-20 11-7 2-25-13-25-5 0-8 7-5 15 4 8 2 17-4 20-11 7-2 25 13 25 5 0 8-7 5-15zm833 205c32-5 30-6-25-13-33-4-67-12-75-18-13-9-13-10 0-7 27 4 60-21 60-46 0-13 7-26 15-30 9-3 15-18 15-34 0-36 7-43 34-33 15 6 30 2 54-14 24-17 29-24 18-28-8-3-16-2-18 3s-15 12-30 15c-22 6-28 4-28-9 0-9 7-16 15-16 18 0 35-31 35-64 0-24 4-26 39-26 22 0 46-3 55-6 11-4 16 0 16 14 0 22 20 34 39 23 8-5 2-15-19-31-27-20-28-24-14-35 16-11 16-12 0-18-9-4-16-17-16-31 0-18 8-27 30-35 17-5 30-14 30-19 0-15-26-22-38-10-7 7-12 1-16-20-12-51-4-116 16-135 10-10 25-31 33-47 12-23 22-30 45-30 25 0 30-4 30-25 0-14 8-29 21-35 17-9 18-14 8-26s-8-16 9-21c21-5 24-11 27-58 1-16 7-20 30-18 20 2 25 0 16-6-20-13 0-65 27-69 31-5 41-23 46-82 3-46 8-58 37-84 19-17 33-36 31-43-2-8 10-18 25-23 17-6 34-23 42-41 7-17 25-36 40-43 15-6 25-18 24-26-2-8 14-34 36-57 42-45 81-56 116-34 17 11 17 12 2 7-27-9-16 15 12 26 18 6 24 4 28-12 3-11 9-20 14-20 11 0 11-11 0-29-7-11-15-11-39-3s-33 7-43-4c-19-23 1-34 60-37 40-1 55 2 62 14 14 26 55 32 94 13 39-18 55-13 55 21 0 13 6 25 13 28 6 2-1 4-16 4-36 1-45 10-23 26 25 18 11 50-20 43-36-9-64 30-55 78 1 5-1 26-4 47-4 25-13 39-26 42-15 4-18 11-14 30 5 19 2 28-14 37-12 6-21 17-21 25 0 20-17 19-40-3-18-16-19-23-9-53 7-19 16-38 20-44 5-5 9-21 9-36 0-31 9-39 52-48 35-7 38-25 4-29-15-2-34 6-51 22-16 14-33 26-40 26-6 0-20 8-31 18-10 10-27 21-37 25s-24 20-30 36c-5 15-23 36-38 47-15 10-25 22-23 26 3 5-4 20-15 34s-23 41-27 60c-3 19-12 34-20 34-9 0-14 11-14 31 0 29-2 30-29 24-30-6-30-6-33 42-3 43-6 49-35 62-32 14-33 16-33 79v64l-32-7c-26-5-29-4-15 5 9 6 17 22 17 36 0 19-6 26-30 31-25 4-30 10-30 34 0 19 5 29 15 29 8 0 15 7 15 15 0 9-9 15-24 15-29 0-44 18-22 26 9 3 16 17 16 30 0 28-8 30-25 8-8-12-20-15-38-10-29 7-38 36-12 36 9 0 19 8 22 18 4 9 11 21 17 25 7 5 6 7-4 6-27-3-40 1-40 11 0 6 6 10 14 10 15 0 28 60 16 74-12 12-30-2-30-24 0-11-9-24-20-30-18-9-20-8-20 15 0 18-9 31-30 43-30 17-30 18-24 75 5 39 3 57-5 57-6 0-13-12-16-27-15-71-22-88-38-91-14-3-17 4-17 40 0 34 6 48 29 70 21 20 27 34 24 52-4 18 0 28 13 33 16 6 16 7-2 14-10 4-32 8-49 9-21 1-25 3-13 8 9 4-27 7-80 7-53 1-81-2-62-5zm155-19c22-5 32-9 23-10-10-1-19-13-23-31-5-22-12-30-28-30l-22 1 21 17c17 15 19 21 10 34-7 9-25 18-41 21-26 3-26 4-5 5 14 0 43-3 65-7zm-69-56c-4-14-14-25-22-25-13 0-15 6-9 27 7 30 28 49 33 32 2-5 1-21-2-34zm46-206c-7-18-22-28-22-14v20c0 8 7 15 15 15 10 0 12-6 7-21zm875 276l28-12-27-8c-35-9-36-31-2-39 16-4 30-18 37-36 6-17 15-30 19-30s8-10 8-21c0-12 7-27 16-33 13-10 11-14-14-33-26-19-34-20-56-10-14 7-26 19-26 27s-12 23-25 33c-23 17-25 17-35-3-6-11-16-18-22-14-7 4-6 9 2 14 6 4 10 24 8 46-3 34-7 40-35 48-17 6-34 18-36 28-3 11-14 18-31 18-21 0-26-5-26-24 0-13 7-26 15-30 8-3 15-12 15-20 0-7 7-16 15-20 8-3 15-15 15-26s9-24 19-28c20-7 21-9 21-36 0-7 14-19 30-26 17-7 30-20 30-29 0-17 50-61 70-61 5 0 10-9 10-21 0-17 5-20 33-17 24 2 33 8 35 26 2 15-2 22-12 22-9 0-16 7-16 15s5 15 10 15c6 0 10-4 10-10 0-5 7-10 15-10s15 7 15 16c0 13 7 15 33 11 17-3 26-3 20 0-7 2-13 16-13 29 0 15-6 24-16 24-13 0-15 9-12 48 3 42 1 47-19 50-13 2-23 10-23 18s-4 14-10 14c-5 0-10 16-10 35 0 26-4 35-17 36-12 1-10 4 7 9l25 8-25 2-25 2 25 8c19 5 11 7-28 7-51 0-52-1-25-12zm-2625-78c-14-38-16-67-4-67 13 0 28 15 35 33 3 9 11 17 17 17 16 0 12-27-6-34-21-8-10-74 17-99 10-10 19-28 19-40 0-23 17-47 32-47 4 0 5 13 2 28-4 19 0 34 10 45 22 22 20 27-10 27-22 0-24 2-14 15 14 17 6 50-10 40-15-9-25 24-11 38 16 16 13 42-7 60-30 27-56 21-70-16zm2264-113c-10-27-6-48 14-74 11-14 20-33 20-42 0-30 27-20 34 13 4 24 0 36-19 57-14 15-25 35-25 44 0 22-16 23-24 2zm-2309-101c6-143 11-153 12-23 0 58-3 111-8 118-4 7-6-36-4-95z" />
          <path d="M-11.796 4029.627c-332.035 17.148-243.258-348.406-330.072-351.74-7 17-24.926-151.22-26.926-177.22-66.12-165.259 353.412-2961.243 292.56-3798.897l3669.326 186.75c86.7 1266.901-83.032 52.783-15 3175.887-13 13-53.222-26.222-59.592-90.63-11.366-55.899-55.07-107.678-72.148-151.962-3-8-12-15-20-15s-19-8-25-17c-5-10-18-18-28-18-11 0-24-13-32-31s-31-41-52-53-46-35-56-51c-9-17-20-30-24-30s-32-24-62-52c-90-86-126-118-133-118-3 0-19-9-35-21-16-11-35-22-42-23s-27-14-44-30c-18-16-43-34-55-40s-25-23-29-38c-10-38-37-73-56-73-10 0-26-17-37-40-12-22-28-45-36-52-12-10-13-16-3-32 19-31 9-138-15-165-21-22-82-137-82-153 0-6-9-18-19-27-11-10-22-30-26-44-4-15-13-34-20-42-23-26-65-112-59-122 3-5 15-6 26-2 12 4 24 1 28-7 5-7 25-12 45-11 24 1 60-11 112-38 41-22 81-40 88-40s18-7 25-15 20-15 30-15c9 0 25-9 35-20s26-20 35-20c10 0 20-9 23-20 4-17 10-20 34-14s26 5 15-8c-10-12-8-20 8-41 26-33 25-53-1-60-15-4-20-11-15-22 3-9 6-23 6-31s15-16 39-20c55-9 69-19 55-41-6-10-21-20-34-21-12-2-24-12-27-22s-11-21-18-24c-7-2-23-26-36-53-25-53-35-63-62-63-14 0-17 5-12 20s0 22-21 30c-50 19-78-16-30-38 19-8 23-16 18-39-2-15-9-34-15-41-12-16-54-8-79 15-16 14-18 14-24-1-3-9-1-23 6-31 15-18-26-113-64-146-20-17-26-31-24-53s-2-31-14-34c-13-2-16 1-12 12 8 22-9 20-29-2-11-12-17-36-17-70 0-52-12-68-25-34-6 16-7 16-21-2-8-11-14-29-14-40 0-28-84-107-144-135-26-12-59-35-73-52-34-40-62-40-34 0 12 16 21 32 21 36s11 18 25 31c40 37 36 48-17 49-26 0-49 5-50 10-2 6 15 19 37 30 21 12 44 32 49 45 6 14 19 37 30 52 16 25 17 32 5 70-12 35-19 44-41 46-34 4-35 16-5 59 20 31 26 33 66 31 58-4 63 13 17 57-20 18-32 36-27 40 6 3 14-2 19-11 7-12 17-15 41-9 42 9 49 30 21 60-12 13-19 28-15 34 3 6-5 16-19 22-13 6-26 19-29 29-3 12-19 20-51 24-43 7-46 9-46 37 0 17-6 32-15 35-39 15 7 54 63 54 28-1 60-34 67-70 9-45 30-51 83-25 37 19 78 11 85-17 5-16 13-19 44-17 21 2 44-1 52-5 16-10 36 8 26 24-4 6-13 9-20 6-7-2-21 4-30 14-20 22-12 28 37 34 56 6 108 71 85 107-6 10-15 19-19 19-5 0-8 7-8 15 0 9-7 18-16 22-8 3-13 12-10 19 6 16-10 28-24 19-8-5-8-11-1-19 7-9 6-19-5-34-8-12-12-27-9-32 13-21-16-8-45 20-31 30-82 41-95 20-3-5-16-10-29-10-36 0-37-10-5-52 33-40 33-64 1-35-12 11-36 17-69 17-36 0-53 4-57 15-3 10-19 15-46 15-33 0-40 3-40 20 0 15 7 20 28 20 43 0 57 14 27 28-14 7-32 12-40 12s-15 5-15 10c0 10 20 14 53 12 28-3 15 20-18 31-22 8-31 6-41-7-14-20-75-24-166-11-55 7-70 17-49 29 5 4 4 19-2 36-10 25-9 33 3 40 9 5 19 5 26-1 17-14 44 0 55 27 5 14 6 44 2 69-6 48-3 52 26 33 10-6 26-8 35-5 13 5 15 15 10 47-7 45 2 53 16 14 14-36 44-28 48 13 5 46-49 117-105 139-35 14-45 14-69 2-31-14-35-26-55-148-7-41-16-86-21-99-5-15-4-28 2-36 15-18-4-29-28-16-11 6-22 8-25 4-3-3-14-2-24 2-10 5-29 10-42 11-36 4-50 23-28 38 9 7 17 18 17 24s12 17 27 24c20 9 28 21 28 39 1 15 9 38 18 52 22 34 21 49-3 91-10 20-15 38-10 41 9 6 1 38-21 80-7 15-6 28 5 50 12 23 13 31 3 34-18 6-27 23-27 54 0 30-20 36-40 12-9-11-16-13-24-5-5 5-18 10-28 10-11 0-18 7-18 19 0 27-16 34-42 19-13-7-44-13-70-13-53 0-61 12-32 53 15 21 14 22-13 22-17 0-40 12-63 34-43 42-97 73-143 81-18 4-51 22-72 41-24 21-54 37-78 41-21 3-41 12-44 19-4 10-25 14-73 14-74 0-98 14-53 31 15 5 46 25 68 43 35 29 50 34 115 39 96 7 203-17 209-48 2-11 8-26 14-33 12-15 79-51 117-62 14-4 33-11 42-15 13-5 20 0 28 19 12 33 25 33 55 0 23-25 24-25 35-5 6 12 21 21 33 22 13 1 6 5-17 10-70 17-89 55-38 77 16 7 18 9 5 6-28-6-39 12-12 19 17 5 20 11 15 29-3 13-6 31-6 40 0 31-60 19-98-19-38-37-62-43-62-14 0 11-9 26-21 34-12 9-16 18-10 21 18 11 1 34-45 61-48 28-52 36-29 55 21 17 19 28-12 61-31 32-63 38-63 12-1-14-5-12-23 10-39 46-52 36-106-75-27-57-51-114-55-128-16-68-36-65-101 18-22 28-48 53-57 57-9 3-25 23-36 43-10 20-25 37-33 37-9 0-13 9-11 22 4 29-15 38-28 13s-30-17-30 13c-1 58-46 133-75 124-5-2-12-23-15-47-3-28-10-44-20-46-8-2-27-6-42-9-31-6-36 6-13 25 8 7 15 27 15 46 0 18 4 36 10 39 13 8 13 112 1 120-6 3-14-2-19-11-11-20-32-10-32 15 0 23-36 56-45 42-11-19-55-13-55 7 0 10-3 22-7 25-10 11-43-24-43-45 0-17-5-19-32-13-42 9-48 13-48 30 0 7 10 15 23 17 14 2 22 10 22 22 0 28-16 28-50 1-27-22-29-27-17-46 17-27 7-37-16-16-10 10-21 14-25 11-3-4-14-4-23 0-13 5-14 10-6 18s8 17 1 30c-12 22-1 108 13 108 6 0 7-11 4-25-5-19-2-25 10-25 10 0 14 5 11 15-4 8-2 17 3 20 6 4 10 16 10 29 0 19 5 22 35 22 38 0 42-6 23-35-17-28-3-54 24-46 34 11 43 22 29 39-9 11-10 20-2 35 22 40 3 107-19 70-13-20-42-20-47 2-6 23-11 24-32 5-22-20-33-10-53 47-16 47-15 50 5 88 25 47 15 65-26 50-34-13-56-56-39-73 19-19 14-45-10-62-20-14-24-14-45-1-13 9-23 13-23 9s-7 0-17 7c-9 8-26 14-37 14-17 0-20 5-18 29 3 20-4 36-23 56-23 24-26 34-21 62 6 33 5 34-36 44-42 9-43 10-44 50-1 48-9 65-29 58-10-4-13 2-12 23 2 21-2 28-15 27-15-1-16 5-11 41 4 29-22.889 73.666-30.889 78.666-11 7 56.481 222.073-38.259 219.146zm621.77-1401.894c-4.891 18.469 3.391 26.26 10.564 31.06 13.882 9.288 29.557 1.683 26.717-15.994-2.668-16.61-5.957-6.496-17.55-17.89-7.08-6.958-15.4-13.526-19.73 2.824zM340.28 2918.689c8.53-29.02-36.071-30.186-51.424 7.18-8.966 21.823 24.523 72.072 25.523 30.072-2.505-36.37 20.02-17.249 25.9-37.252zm435.072-25.874c-13-9-15-15-7-20 16-10 15-26-2-26-24 0-25 26-3 54 12 15 23 22 25 16s-4-17-13-24zm55-227c0-20-15-26-25-9-9 15 3 43 15 35 5-3 10-15 10-26zm236-624c-27-20-67-20-60 0 4 10 19 15 43 15 34-1 35-2 17-15zm-62-275c23-9 26-15 26-63 0-30-3-56-6-59-3-4-22 5-41 18-33 22-57 27-138 28-17 1-42 10-56 21l-26 21h52c31 0 62 6 77 16 13 9 35 18 49 21 13 2 27 5 31 6 4 0 18-3 32-9zm612-120c24-10 31-24 15-34-14-9 0-56 20-67 11-5 19-14 19-19 0-17-20-11-43 13-12 13-32 29-44 36-19 10-23 20-23 59 0 54 23 92 28 47 2-17 12-29 28-35zm159-211c4-6 19-7 35-4 15 3 30 2 33-2 9-14-26-50-55-57-23-5-28-3-28 11 0 10-3 28-6 41-6 22 9 31 21 11zm-497-192c3-23-23-76-38-77-8 0-4 73 5 93 10 25 29 16 33-16zm-244-70c3-18 13-43 22-56 15-20 23-23 61-18 25 3 58 14 74 26s29 17 29 11c0-5-4-10-8-10-5 0-17-15-27-34-11-19-30-40-44-48-14-7-34-21-45-31-13-14-27-17-49-13-16 3-45 6-65 6h-35l8 38c10 50 10 71 1 110-7 28-5 32 13 32 11 0 23 5 26 10 13 21 33 9 39-23zm1506-3c0-9-7-14-17-12-25 5-28 28-4 28 12 0 21-6 21-16zm-1085-4c10-17-5-70-20-70-17 0-21 6-30 48-6 29-5 32 19 32 13 0 28-5 31-10zm-631-69c7-11-89-101-109-101-28 0-16 28 23 51 20 13 43 31 50 41 14 20 28 23 36 9z" />
          <path d="M197.352 3669.815c-8-10-17-29-19-43-1-14-8-25-15-25-17 0-26-12-18-25 5-8 10-8 20 0 7 6 19 8 28 4 8-3 25 0 37 6 16 9 20 17 15 33-4 12-6 32-6 45 1 26-20 29-42 5zm123-33c-6-11-16-19-23-17-7 1-12-4-12-12s14-15 38-17c36-3 37-2 37 31 0 40-22 48-40 15zm70-34c0-7 7-19 15-26 12-10 16-9 21 3 3 9 3 21-1 27-9 15-35 12-35-4zm1810-5c0-9 65-81 74-81 3 0 15 8 26 17 24 21 27 63 5 63-8 0-15-7-15-15s-7-15-15-15-15 9-15 20c0 16-7 20-30 20-16 0-30-4-30-9z" />
          <path d="M2393.352 3582.815c3-8-1-17-9-20s-14-12-14-21c0-8-7-15-15-15s-15-7-15-15-4-15-10-15c-5 0-10 5-10 10 0 6-7 10-15 10s-15-4-15-9c0-6-16-7-35-4-34 6-35 5-35-29 0-20 7-41 15-48 9-8 12-22 8-41-4-22-2-29 11-29 10 0 16 9 16 25 0 22 24 45 48 45 10 0 62-95 62-112 0-14 82-88 96-88 13 0 24-17 38-63 5-17 7-17 31-1 28 18 28 41 1 36-20-4-21 17-1 24 25 10 17 34-10 34-21 0-25 5-25 30 0 19-6 33-16 37-14 5-13 8 7 18 13 7 28 12 33 11 6-2 8-1 4 1-5 3-8 25-8 49 0 32-4 44-15 44-10 0-15-10-15-27v-27l-20 20c-15 15-21 35-22 78-1 35-6 60-14 63-7 2-14 13-17 24-3 10-13 19-22 19-11 0-15-5-12-14zm67-11c0-16 6-25 15-25s15 9 15 25-6 25-15 25-15-9-15-25zm164-99c3-14 2-28-4-31-15-9-12-25 5-25 8 0 15-9 15-20s4-20 9-20c14 0 41-59 41-87 0-21 4-24 33-21 26 2 33-1 35-19 2-13 14-25 33-32 16-5 29-15 29-20 0-17 27-13 34 4 3 8 16 15 28 15 13 0 30 5 38 10 12 8 9 10-10 8-27-3-31 13-16 60 6 18 4 22-13 22-12 0-21 5-21 10 0 27-49-8-63-44-7-17-9-16-27 7-11 14-20 37-20 51 0 16-8 30-21 37-12 6-34 23-50 37-22 19-26 28-18 38 16 19 3 44-22 44-17 0-20-4-15-24zm-2310-70c-4-10-2-22 4-28 8-8 13-7 18 6 4 10 2 22-4 28-8 8-13 7-18-6zm1186-31c0-24 5-35 15-35s15 11 15 35-5 35-15 35-15-11-15-35zm1072-17c-7-7-12-24-12-39 0-21 6-28 26-33 33-9 42-1 26 25-7 11-10 29-7 40 7 22-14 26-33 7zm-2058-21c-6-18 11-47 28-47 10 0 1 39-13 54-5 6-11 2-15-7zm926-62c0-43 2-45 44-65 57-26 66-25 66 4 0 20-6 25-40 31-46 8-48 13-18 39 18 15 25 17 41 7 13-9 23-9 30-2 13 13 0 17-70 25l-53 5zm1188-12c-21-5-30-28-21-61l6-26 9 23c10 27 32 23 36-7 2-12 7-22 12-22 10 0 23-37 24-70 1-15 7-26 16-26 8-1 21-2 29-3 11-1 11-4 1-16-14-16-6-35 16-35 8 0 14-6 14-12 0-7 5-5 11 5 7 13 7 22 0 31-9 10-8 15 4 20 17 6 21 36 5 36-17 0-101 88-90 95s-30 75-45 74c-5-1-17-3-27-6zm268-78c-3-8-15-15-27-15-16 0-19-4-15-17 4-9 2-19-3-23-6-3 14-5 43-5 30 0 49 3 43 8-9 5-7 11 6 21 23 18 21 32-5 40-33 8-35 8-42-9zm-553-2c-15-5-18-53-4-53 5 0 12-30 16-67 6-62 35-133 54-133 4 0 15-18 25-40 16-37 66-77 79-64 2 3 1 17-4 32-30 97-37 127-29 130 6 2 2 11-7 20-15 16-15 17 0 20 22 4 22 28 0 36-12 5-14 9-5 18s5 15-18 24c-22 10-30 20-30 39 0 32-42 53-77 38zm-1683-58c0-9 9-15 25-15s25 6 25 15-9 15-25 15-25-6-25-15z" />
          <path d="M2603.352 3124.815c-41-14-44-44-7-83 21-23 24-32 15-46-7-12-7-20 0-24 7-5 6-11-1-20-20-24 26-29 49-6 12 12 28 21 36 21 10 0 15 11 15 35 0 31-3 35-25 35-23 0-25 3-25 50 0 54-2 55-57 38zm-1726-234c-18-24-15-50 4-38 5 3 16 1 24-6 20-16 31 7 12 28-8 9-16 22-18 29-2 6-12 1-22-13zm418 19c19-15 35-52 25-58-12-8 39-65 57-65 7 0 13-6 13-13 0-14 35-47 50-47 13 0 13 57 0 65-5 3-10 15-10 26 0 13-10 24-29 30-20 7-28 15-24 25 3 9-2 14-15 14-11 0-22 5-24 12-2 6-15 13-29 15-13 2-19 0-14-4zm1625-112c-43-12-38-80 6-81 6 0 16 17 22 39 18 57 19 55-28 42zm-190-16c0-15 26-32 36-23 2 3 2 13-2 22-8 20-34 21-34 1zm256-28l-28-12 41-1c29-1 41 3 41 12 0 17-16 17-54 1zm-196-124c0-11 7-13 24-9 20 5 28 0 43-24 20-35 43-39 43-7-1 36-21 53-67 54-32 0-43-3-43-14zm-216-154c-9-15 12-33 30-26 9 4 16 13 16 22 0 17-35 21-46 4zm-624-18c0-11-3-26-6-35-7-19 6-21 30-3 16 12 17 16 5 35-17 27-29 28-29 3zm-93-178c-10-3-17-12-15-21 5-24 29-21 39 6 9 22 7 23-24 15zm221-189c-11-10 3-34 19-34 8 0 13 7 11 17-3 18-20 27-30 17zm4-161c4-22 43-25 43-3 0 8-11 16-23 18-19 3-23 0-20-15zm62-66c-8-22 7-40 29-35 14 3 14 6-3 28-17 23-19 23-26 7zm146-316c0-29 21-57 33-44 4 3 7 21 7 40 0 26-4 33-20 33-15 0-20-7-20-29zm-60-38c0-26 39-85 50-78 14 9 12 69-2 83-18 18-48 15-48-5zm250-155c0-29 15-45 25-28 3 5-1 20-9 32l-16 22zm114-49c-10-17 13-36 27-22 12 12 4 33-11 33-5 0-12-5-16-11zm-109-8c-3-5-19-12-35-16-21-5-30-13-30-26 0-17 7-19 60-19 51 0 61 3 71 22 10 18 8 24-7 35-21 15-50 17-59 4zm20-570c-3-11-12-22-20-25s-15-18-15-33v-28l-19 24-18 24-18-26c-20-32-11-51 21-43 26 7 31-3 13-21-13-13-5-43 11-43 6 0 14 8 17 17 4 10 20 29 36 42 23 19 28 30 23 52-3 16-1 31 4 34 6 3 10 15 10 26 0 25-37 26-45 0zm100 0c-8-15 3-31 21-31 9 0 14 7 12 17-4 20-24 28-33 14zm-280-50c-7-13 17-24 40-19 9 1 16 8 16 13 0 14-48 19-56 6z" />
        </g>
        <g fill="#f0f2f5">
          <path d="M1231 3413c-22-4-23-8-17-56 13-92 57-108 123-43 40 38 41 46 6 46-25 0-25 1-9 19 17 19 17 20-21 30-39 11-42 11-82 4zm114-718c-8-14-22-37-31-51-13-21-13-28-3-41 11-13 10-17-6-29-38-26-45-35-45-59 0-13-4-27-10-30-5-3-10-14-10-24 0-16 12-19 98-24 128-7 172-20 172-52 0-19 11-29 56-51 78-38 91-21 30 44-27 28-72 98-107 168-95 183-112 201-144 149zm-340-417c-29-28-35-42-41-93-5-53-3-63 17-89s26-28 67-22c25 3 59 13 75 21 37 19 36 19 30-4-9-35-142-88-205-82-21 2-28-2-28-16 1-43 14-48 127-47 60 0 121 4 136 8 26 6 27 5 17-14-9-18-19-20-83-18-40 1-107-2-149-6-74-9-77-10-83-37-4-16-4-42 0-59 6-30 7-30 66-25 57 5 60 4 69-20 18-47 12-113-15-163-14-26-25-57-25-69 0-26-3-28-30-11-18 11-23 9-44-16-23-30-56-31-56-2 0 7-6 16-14 19-22 9-54 81-53 121 1 49-14 60-81 61-55 0-57-1-60-28-2-16 6-61 18-100 12-40 29-97 37-127 16-64 72-190 84-190 5 0 20-20 34-43 26-46 34-73 12-43-10 13-20 16-35 12-22-7-28-30-16-60 7-19 50-21 57-3 3 7 6 5 6-5 1-17-84-120-121-146-27-19-22-42 22-125 22-41 47-101 56-133 37-143 127-268 256-356 22-15 63-47 90-70 28-24 63-50 78-58 100-54 143-66 161-44 17 20 82 17 105-5 11-10 42-23 70-29 183-41 191-43 218-32 15 5 42 10 59 10 47 1 101 31 105 58 3 17-1 22-20 22-13 0-29 5-35 11s-21 9-34 7c-19-2-23-8-21-29 3-31-20-45-38-24-9 11-6 22 17 52 60 80 158 167 108 97-17-25-11-34 22-34 16 0 23-6 23-19 0-11-5-23-10-26-21-13 1-24 38-18 83 11 99 21 106 63 5 34 2 42-24 68-32 33-38 52-16 52 20 0 76 49 76 65 0 18 38 54 68 66 27 10 31 49 4 49-9 0-23-10-31-21-10-17-15-19-21-9-10 16 8 70 23 70 6 0 3 6-8 13-14 11-15 16-5 22 9 5 15 4 18-3 7-21 42-14 42 8 0 12-7 20-16 20-12 0-15 9-12 38 2 31 0 37-15 35-11 0-27 7-38 18-15 15-17 24-9 44 5 14 7 31 4 39-7 18 18 31 74 41 33 5 42 11 42 27s-6 19-33 17c-42-4-54 4-62 41-6 27-10 30-48 31l-42 1 32 14c31 13 50 45 38 64-11 18-58 10-84-14-34-31-120-60-137-45-15 12-40 1-68-30-26-28-38-27-24 3 11 26 60 52 93 49 11-1 49 15 85 35 51 30 65 43 65 62 0 13 6 25 13 28 6 2 12 12 12 21 0 17-13 26-72 50-17 6-28 18-28 30 0 10-7 21-15 25-8 3-20 17-25 31-12 33-36 32-52-2-19-39-38-41-38-4 0 17-2 31-5 31s-32-11-65-25-66-25-73-25c-8 0-22-9-32-20s-21-18-24-15c-13 7-4 55 14 75 17 19 17 20-9 29-14 6-26 15-26 20 0 19-91 95-133 110-53 20-97 51-80 58 12 4-13 36-95 121-21 21-23 31-17 69 5 32 12 46 27 52 14 5 18 10 10 15-7 4-12 16-12 28 0 18 2 19 16 7 14-11 20-9 41 15 13 15 22 33 20 40-7 20-35 18-56-6l-21-22 6 34c4 19 11 37 16 38 5 2 4 10-2 17-8 9-6 14 5 19 19 7 19 40 0 56-11 9-14 23-9 45 5 28 0 37-38 76-24 24-57 51-73 59-17 8-38 21-47 28-12 11-31 13-62 9-34-5-45-3-50 8-9 25-44 17-81-17zm-155-858c28-14 40-27 40-42 0-27 21-99 33-115 10-14 67-18 67-5 0 4 4 13 9 21 7 11 14 10 44-4 22-10 53-15 88-13 47 3 54 6 57 26 4 25 8 26 49 12 20-7 35-23 47-50 28-65 68-59 145 20 70 72 107 82 98 25-4-26-2-35 8-35 8 0 19-9 25-20s21-20 34-20c15 0 26 7 29 20 10 37 25 20 29-31 2-32-2-54-9-61-7-6-13-22-13-37s-4-31-10-37c-11-11 2-70 16-67 5 2 10 18 12 38 2 21 9 35 16 35 8 0 20 10 29 23 8 12 18 19 22 15 11-11-3-56-25-78-10-10-20-31-22-47-3-24-7-28-30-25-28 3-46-12-28-23 16-10 12-22-11-28-27-7-20-31 10-35 13-2 26-14 32-29 5-14 23-30 40-36 30-12 31-13 25-59-5-32-2-59 9-84 23-56 20-67-16-62-27 4-32 1-41-24-11-32-33-39-23-8 6 18 3 20-17 15-19-5-26 1-43 31-21 40-50 72-81 90-19 11-55 71-69 115-4 13-18 38-31 55s-24 35-24 40c0 4-12 18-27 30l-27 22 18 71c10 39 16 77 12 86-7 20-45 20-52 0-4-9-31-27-62-42-31-14-76-46-100-71-44-43-45-44-91-36-25 4-59 7-75 5-18-2-36 5-51 19-21 20-22 24-9 48 22 43 18 125-10 180-13 26-26 60-30 75s-20 47-36 69c-46 62-42 69 20 38zm1210-528c0-4-6-14-12-20-10-10-10-17 0-33 12-18 11-24-7-41-14-12-29-17-41-13-27 9-25 29 5 49 14 9 25 25 25 35s3 21 7 24c9 10 23 9 23-1zm-70-431c0-10 6-24 14-30 13-11 12-15-2-32-20-23-32-24-32-4 0 8-7 15-16 15-11 0-15 6-11 20 3 11 1 23-4 26-15 9-10 27 6 21 8-4 17-2 20 4 9 14 25 1 25-20z" />
          <path d="M1073 1223c-35-7-45-25-32-61 9-27 17-32 56-38 53-8 73 8 73 58 0 40-31 54-97 41zm568-471c-12-22-6-32 21-32 21 0 24 23 4 39-12 10-17 8-25-7zm19-77c-14-16-5-35 16-35 15 0 20 35 5 44-5 3-14-1-21-9zm-231 1148c-14-36-8-88 10-88 14 0 21 17 34 83 6 27 4 32-13 32-13 0-24-10-31-27zm878-909c-15-15 8-34 42-34h36l-30 20c-32 21-38 23-48 14zM156 65c-10-28-7-45 9-45s20 27 6 48c-7 11-10 10-15-3z" />
        </g>
      </g>
    </svg>
  );
};

export const Welcome: React.FC = () => {
  const { texts } = useContext(LocaleContext);

  return (
    <section
      css={css`
        position: relative;
        height: 100%;
        flex: 1;
        z-index: 0;

        /* needed for proper scaling on Chrome */
        display: flex;
        flex-direction: column;
      `}
    >
      <Global
        /**
         * this is pretty ugly, because we depend on globally defined className
         * we should consider emotion-theming
         * and holding the theme as state over ThemeProvider
         * @example
         * <GlobalThemeOverride
         *   theme={{
         *     backgroundColor: 'blue'
         *   }}
         * />
         */
        styles={css`
          .ant-layout-header,
          .ant-menu-sub,
          .ant-menu-item,
          .ant-menu.ant-menu-dark .ant-menu-item-selected {
            background-color: ${Colors.PrimaryLight};
          }

          .ant-menu-dark .ant-menu-item:hover {
            background-color: ${Colors.PrimaryLight};
          }
        `}
      />
      <Flex height="100%" center width="38em" maxWidth="100%" flex={1}>
        <div
          css={css`
            border-radius: 5px;
            font-size: 1.5em;
            color: white;

            padding-bottom: 4.5em;
          `}
        >
          <article
            css={css`
              padding: 1em;
              border-radius: 5px;
              @media (max-width: 1000px) {
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                box-shadow: 3px 2px 21px rgba(0, 0, 0, 0.35);
              }
            `}
          >
            <h1
              css={css`
                font-size: 1.5em;
                font-weight: bold;

                color: inherit;
              `}
            >
              {texts.welcomeToTheApp}
            </h1>
            <Flex center>
              <LinkButton
                ghost
                to="/login"
                size="large"
                css={css`
                  height: auto;
                  margin-top: 0.5em;
                  padding: 0.5em 1em;
                  border-width: 2px;

                  font-size: inherit;
                  font-weight: 600;

                  box-shadow: 0 0 0 1px transparent;

                  :hover,
                  :focus {
                    color: unset;
                    border-color: unset;

                    box-shadow: 0 0 0 1px currentColor;
                  }
                `}
              >
                {texts.login}
              </LinkButton>
            </Flex>
          </article>
        </div>
      </Flex>

      <Background />
    </section>
  );
};
