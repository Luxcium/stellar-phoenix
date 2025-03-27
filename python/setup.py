from setuptools import setup, find_packages

setup(
    name="stellar-phoenix-python",
    version="0.1.0",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "python-dotenv>=1.0.0",
        "pydantic>=2.6.1",
        "aiofiles>=23.2.1",
    ],
    extras_require={
        "dev": [
            "pytest>=8.0.0",
            "pytest-cov>=4.1.0",
            "pytest-asyncio>=0.23.5",
            "black>=24.2.0",
            "flake8>=7.0.0",
            "mypy>=1.8.0",
            "isort>=5.13.2",
        ],
    },
    author="",
    description="Stellar Phoenix Python Services",
    long_description=open("README.md").read() if open("README.md") else "",
    long_description_content_type="text/markdown",
)
