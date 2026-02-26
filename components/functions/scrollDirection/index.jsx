export default function scrollToInput(inputRef, scrollRef) {
    if (!inputRef?.current || !scrollRef?.current) return;

    inputRef.current.measureLayout(
        scrollRef.current,
        (x, y) => {
            scrollRef.current.scrollTo({
                y: y - 100,
                animated: true,
            });
        },
        (error) => {
            console.log("Erro ao medir:", error);
        }
    );
}
