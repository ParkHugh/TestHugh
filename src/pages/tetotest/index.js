import dynamic from 'next/dynamic';
const TetoTest = dynamic(() => import('../../tests/tetotest/TetoTest'), { ssr: false });
export default TetoTest;
