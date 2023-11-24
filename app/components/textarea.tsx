const Textarea = ({ disabled = false, rows = 3, className, ...props }) => (
    <textarea
        disabled={disabled}
        rows={rows}
        className={`${className} rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        {...props}
    />
)

export default Textarea
