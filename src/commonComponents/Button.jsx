const Button = ({ children, icon, ...props }) => {
  return (
    <button
      {...props}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
