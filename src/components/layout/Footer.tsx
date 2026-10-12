const Footer = () => {
  return (
    <footer>
      <div className='text-muted-foreground mx-auto flex max-w-360 items-center px-4 py-3 text-sm sm:px-6'>
        <p>{`© ${new Date().getFullYear()} Product Dashboard`}</p>
      </div>
    </footer>
  )
}

export default Footer
