const Input = ({ label, value, onChange, id, placeholder }) => {
  return (
    <div className="mt-8 flex flex-col space-y-1">
      <label className="text-sm dark:text-white text-gray-500">{label}</label>
      <input
        className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
      />
    </div>
  );
};

export default Input;
