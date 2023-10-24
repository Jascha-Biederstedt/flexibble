import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='flexStart footer'>
      <div className='flex flex-col gap-12 w-full'>
        <div className='flex items-start flex-col'>
          <Image
            src='/logo-purple.svg'
            width={115}
            height={38}
            alt='Flexibble Footer Logo'
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
