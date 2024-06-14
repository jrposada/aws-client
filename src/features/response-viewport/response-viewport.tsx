import { FunctionComponent, PropsWithChildren } from 'react';
import ResizableHeightBox from '../../ui/resizable-box';
import { t } from 'i18next';

const ResponseViewport: FunctionComponent<PropsWithChildren> = ({
    children,
}) => {
    return (
        <>
            <ResizableHeightBox>
                {children ?? t('response-viewport.placeholder')}
            </ResizableHeightBox>
        </>
    );
};

export default ResponseViewport;
