import Image from "next/image";
import CancelImg from "../../assets/cancel.png";
// import SuccessImg from "../../assets/success.png";
// import WarringImg from "../../assets/warring.png";

interface InputWrapperProps {
  children?: React.ReactNode;
}

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  disabled?: boolean;
  onDelete?: () => void;
};

function InputWrapperMain({ children }: InputWrapperProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function InputWrapperLabel({ children, ...props }: InputLabelProps) {
  return (
    <label {...props} className="text-text text-[15px] font-medium">
      {children}
    </label>
  );
}

function InputWrapperField({
  className,
  value,
  disabled = false,
  onChange,
  onDelete,
  ...props
}: InputFieldProps) {
  const fieldStyle = disabled
    ? "border-[#D5D9DD] bg-[#F2F3F5] text-[#1A1A1A80]"
    : "border-primary-300 bg-white";

  return (
    <div className="relative">
      <input
        {...props}
        value={value}
        onChange={onChange}
        className={` rounded-lg border cursor-pointer ${fieldStyle} w-full px-4 py-3 font-normal ${className ?? ""} outline-[#BFDEBE]`}
      />
      {value && !disabled && (
        <Image
          src={CancelImg}
          alt="cancel"
          width={20}
          height={20}
          onClick={onDelete}
          className="bg-[#888F9C] ring p-1 rounded-[50px] absolute right-3.5 top-3.5 cursor-pointer z-10"
        />
      )}
      {/* {value && !disabled && (
        <div className="flex mt-1">
          <Image src={SuccessImg} alt="success" width={20} height={20} />
          <p className="text-[12px] text-[#51A05C] font-normal">
            사용 가능한 닉네임입니다.
          </p>
          <Image src={WarringImg} alt="success" width={20} height={20} />
          <p className="text-[12px] text-[#CC0003] font-normal">
            이미 등록된 닉네임입니다.
          </p>
        </div>
      )} */}
    </div>
  );
}

const InputWrapper = Object.assign(InputWrapperMain, {
  Label: InputWrapperLabel,
  Input: InputWrapperField,
});

export default InputWrapper;
