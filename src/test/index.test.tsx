import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Plotly from '../index';

Enzyme.configure({ adapter: new Adapter() });

test('tests', () => {
  expect(true).toBe(true);
});
