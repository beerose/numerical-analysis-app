import { PaddingContainer } from '../../components';
import { AuthStoreState } from '../../AuthStore';

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  return <PaddingContainer>{JSON.stringify(props)}</PaddingContainer>;
};

export default StudentHome;
