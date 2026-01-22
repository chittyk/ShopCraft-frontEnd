const Button = ({ children, variant = "primary", ...props }) => {
  const styles = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "bg-gray-800 text-gray-200 hover:bg-gray-700",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
