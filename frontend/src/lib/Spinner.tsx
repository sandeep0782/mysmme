const Spinner = () => {
    return (
        <div className="flex min-h-[300px] items-center justify-center">
            <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full border-4 border-red-100" />

                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 shadow-[0_0_12px_rgba(220,38,38,0.25)]" />

                <div className="absolute inset-[9px] rounded-full bg-white" />
            </div>
        </div>
    );
};

export default Spinner;