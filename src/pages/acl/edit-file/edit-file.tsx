import { JsonCodeEditor } from '../../../components/json-code-editor/json-code-editor.tsx';
import { useOutletContext } from 'react-router-dom';

export const EditFile = () => {
  const { value, onChange } = useOutletContext<{ value: string; onChange: (value: string) => void }>();

  return (
    <div className="py-2">
      <JsonCodeEditor value={value} onChange={onChange}/>
    </div>
  );
}