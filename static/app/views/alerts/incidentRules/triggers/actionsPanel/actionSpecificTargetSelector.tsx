import {t} from 'app/locale';
import {Action, ActionType, TargetType} from 'app/views/alerts/incidentRules/types';
import Input from 'app/views/settings/components/forms/controls/input';

type Props = {
  action: Action;
  disabled: boolean;
  onChange: (value: string) => void;
};

function ActionSpecificTargetSelector({action, disabled, onChange}: Props) {
  const handleChangeSpecificTargetIdentifier = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(e.target.value);
  };

  if (action.targetType !== TargetType.SPECIFIC || action.type !== ActionType.SLACK) {
    return null;
  }
  return (
    <Input
      type="text"
      autoComplete="off"
      disabled={disabled}
      key="inputChannelId"
      value={action.inputChannelId || ''}
      onChange={handleChangeSpecificTargetIdentifier}
      placeholder={t('optional: channel ID or user ID')}
    />
  );
}

export default ActionSpecificTargetSelector;
