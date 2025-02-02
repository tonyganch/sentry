import {Fragment} from 'react';
import styled from '@emotion/styled';

import Button from 'app/components/button';
import FeatureBadge from 'app/components/featureBadge';
import * as Layout from 'app/components/layouts/thirds';
import Link from 'app/components/links/link';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {Organization} from 'app/types';

type Props = {
  organization: Organization;
  activeTab: 'stats' | 'team';
};

function StatsHeader({organization, activeTab}: Props) {
  return (
    <Fragment>
      <BorderlessHeader>
        <StyledHeaderContent>
          <StyledLayoutTitle>{t('Stats')}</StyledLayoutTitle>
        </StyledHeaderContent>
        {activeTab === 'team' && (
          <Layout.HeaderActions>
            <Button
              title={t('Send us feedback via email')}
              size="small"
              href="mailto:workflow-feedback@sentry.io?subject=Team Stats Feedback"
            >
              {t('Give Feedback')}
            </Button>
          </Layout.HeaderActions>
        )}
      </BorderlessHeader>
      <Layout.Header>
        <Layout.HeaderNavTabs underlined>
          <li className={`${activeTab === 'stats' ? 'active' : ''}`}>
            <Link to={`/organizations/${organization.slug}/stats/`}>
              {t('Usage Stats')}
            </Link>
          </li>
          <li className={`${activeTab === 'team' ? 'active' : ''}`}>
            <Link to={`/organizations/${organization.slug}/stats/team/`}>
              {t('Team Stats')}
              <FeatureBadge type="beta" />
            </Link>
          </li>
        </Layout.HeaderNavTabs>
      </Layout.Header>
    </Fragment>
  );
}

export default StatsHeader;

const BorderlessHeader = styled(Layout.Header)`
  border-bottom: 0;

  /* Not enough buttons to change direction for mobile view */
  grid-template-columns: 1fr auto;
`;

const StyledHeaderContent = styled(Layout.HeaderContent)`
  margin-bottom: 0;
`;

const StyledLayoutTitle = styled(Layout.Title)`
  margin-top: ${space(0.5)};
`;
