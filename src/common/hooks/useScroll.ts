import { useState, useEffect, RefObject, useRef, useCallback } from 'react';

/**
 * Custom hook for detecting scroll events and determining if scrolled to end
 * @param container The ref object of the HTML element which has scroll
 * @param offset Scroll offset. Default value is 100
 * @returns [boolean | null, Function | undefined] If element is not found, returns null as the first array item,
 * If element is found and scrolled to end, returns true as the first item.
 * Returns a reset function as the second array item.
 */

type useScrollProps = {
    container: RefObject<HTMLElement | null> | null;
    offset?: number;
};

const useScroll = ({
    container,
}: useScrollProps): [boolean | null, (() => void) | undefined] => {
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState<boolean>(false);
    const scrollElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const elementSearcher = setInterval(() => {
            const element: HTMLElement | null = container?.current || null;
            if (element) {
                scrollElementRef.current = element;
                scrollElementRef.current.addEventListener('scroll', processScroll);
                setHasScrolledToEnd(false);
                clearInterval(elementSearcher);
            }
        }, 700);
        return () => {
            clearInterval(elementSearcher);
            if (scrollElementRef.current) {
                scrollElementRef.current.removeEventListener('scroll', processScroll);
                scrollElementRef.current.scrollTop = 0;
            }
        };
    }, []);

    const reset = useCallback(() => {
        setHasScrolledToEnd(false);
    }, []);

    const processScroll = useCallback(() => {
        if (!scrollElementRef.current) {
            return;
        }
        const scrollEndValue = 1;
        const eleScrollTop: number = Math.round(scrollElementRef.current.scrollTop);
        const eleScrollHeight: number = Math.round(
            scrollElementRef.current?.scrollHeight,
        );
        const eleClientHeight: number = Math.round(
            scrollElementRef.current.clientHeight,
        );
        if (eleScrollHeight - eleScrollTop - eleClientHeight <= scrollEndValue) {
            setHasScrolledToEnd(true);
        }
    }, []);

    if (!container?.current) {
        return [null, undefined];
    }

    return [hasScrolledToEnd, reset];
};

export default useScroll;
