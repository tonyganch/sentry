import {Fragment} from 'react';
import styled from '@emotion/styled';

import UserAvatar from 'app/components/avatar/userAvatar';
import CommitLink from 'app/components/commitLink';
import {BannerContainer, BannerSummary} from 'app/components/events/styles';
import TimeSince from 'app/components/timeSince';
import Version from 'app/components/version';
import {IconCheckmark} from 'app/icons';
import {t, tct} from 'app/locale';
import space from 'app/styles/space';
import {
  GroupActivity,
  GroupActivitySetByResolvedInRelease,
  GroupActivityType,
  ResolutionStatusDetails,
} from 'app/types';

type Props = {
  statusDetails: ResolutionStatusDetails;
  projectId: string;
  activities?: GroupActivity[];
};

function renderReason(
  statusDetails: ResolutionStatusDetails,
  projectId: string,
  activities: GroupActivity[]
) {
  const actor = statusDetails.actor ? (
    <strong>
      <UserAvatar user={statusDetails.actor} size={20} className="avatar" />
      <span style={{marginLeft: 5}}>{statusDetails.actor.name}</span>
    </strong>
  ) : null;

  const relevantActivity = activities.find(
    activity => activity.type === GroupActivityType.SET_RESOLVED_IN_RELEASE
  ) as GroupActivitySetByResolvedInRelease | undefined;

  const currentReleaseVersion = relevantActivity?.data.current_release_version!;

  if (statusDetails.inNextRelease && statusDetails.actor) {
    return tct('[actor] marked this issue as resolved in the upcoming release.', {
      actor,
    });
  }
  if (statusDetails.inNextRelease) {
    return t('This issue has been marked as resolved in the upcoming release.');
  }
  if (statusDetails.inRelease && statusDetails.actor) {
    return currentReleaseVersion
      ? tct('[actor] marked this issue as resolved in versions greater than [version].', {
          actor,
          version: (
            <Version
              version={currentReleaseVersion}
              projectId={projectId}
              tooltipRawVersion
            />
          ),
        })
      : tct('[actor] marked this issue as resolved in version [version].', {
          actor,
          version: (
            <Version
              version={statusDetails.inRelease}
              projectId={projectId}
              tooltipRawVersion
            />
          ),
        });
  }
  if (statusDetails.inRelease) {
    return currentReleaseVersion
      ? tct(
          'This issue has been marked as resolved in versions greater than [version].',
          {
            version: (
              <Version
                version={currentReleaseVersion}
                projectId={projectId}
                tooltipRawVersion
              />
            ),
          }
        )
      : tct('This issue has been marked as resolved in version [version].', {
          version: (
            <Version
              version={statusDetails.inRelease}
              projectId={projectId}
              tooltipRawVersion
            />
          ),
        });
  }
  if (!!statusDetails.inCommit) {
    return tct('This issue has been marked as resolved by [commit]', {
      commit: (
        <Fragment>
          <CommitLink
            commitId={statusDetails.inCommit.id}
            repository={statusDetails.inCommit.repository}
          />
          <StyledTimeSince date={statusDetails.inCommit.dateCreated} />
        </Fragment>
      ),
    });
  }
  return t('This issue has been marked as resolved.');
}

function ResolutionBox({statusDetails, projectId, activities = []}: Props) {
  return (
    <BannerContainer priority="default">
      <BannerSummary>
        <StyledIconCheckmark color="green300" />
        <span>{renderReason(statusDetails, projectId, activities)}</span>
      </BannerSummary>
    </BannerContainer>
  );
}

const StyledTimeSince = styled(TimeSince)`
  color: ${p => p.theme.gray300};
  margin-left: ${space(0.5)};
  font-size: ${p => p.theme.fontSizeSmall};
`;

const StyledIconCheckmark = styled(IconCheckmark)`
  /* override margin defined in BannerSummary */
  margin-top: 0 !important;
  align-self: center;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    margin-top: ${space(0.5)} !important;
    align-self: flex-start;
  }
`;

export default ResolutionBox;
