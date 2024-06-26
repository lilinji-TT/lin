/**
 * Form 组件原理大体就是将表单项，
 * 使用context保存，
 * 然后在item中拿出来改变，
 * 进行验证这些操作，
 * 修改保存在context中的值
 */
import { From as InternalForm } from "./Form";
import { Item } from "./Item";
type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
  Item: typeof Item;
}

const Form = InternalForm as FormInterface;

Form.Item = Item;

export default Form;
