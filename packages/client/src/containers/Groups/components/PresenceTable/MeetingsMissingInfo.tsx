import React from 'react';
import { Link } from 'react-router-dom';

import { LocaleContext } from '../../../../components/locale';
import { Flex } from '../../../../components/Flex';

export const MeetingsMissingInfo = () => (
  <LocaleContext.Consumer>
    {({ texts }) => (
      <Flex
        justifyContent="center"
        alignItems="center"
        flex={1}
        flexDirection="column"
        fontSize="1.4em"
      >
        <Flex fontSize="1.6em" paddingBottom="0.5em">
          {texts.thereAreNoMeetings}
        </Flex>
        <div>
          {texts.doYouWantToCreateAMeeting}{' '}
          <Link to="meetings">{texts.goToMeetings}</Link>
        </div>
      </Flex>
    )}
  </LocaleContext.Consumer>
);
